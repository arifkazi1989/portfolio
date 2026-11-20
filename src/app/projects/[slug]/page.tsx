import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const builder = imageUrlBuilder(client)

const getImageUrl = (source: any) => {
  if (!source) return null
  if (typeof source === 'string') return source
  if (source?.url) return source.url
  if (source?.asset?.url) return source.asset.url
  try {
    return builder.image(source).auto('format').fit('max').url()
  } catch {
    return null
  }
}

const getCaseStudyData = async (slug: string) => {
  const query = `{
    "homepage": *[_type == "homepage"][0]{
      email,
      phone,
      heroTitle
    },
    "project": *[_type == "caseStudy" && slug.current == $slug][0]{
      _id,
      title,
      subtitle,
      description,
      slug,
      client,
      company,
      industry,
      role,
      platform,
      period,
      tags,
      "thumbnailUrl": coalesce(thumbnail.asset->url, mainImage.asset->url),
      "heroImageUrl": coalesce(
        heroImage.asset->url,
        coverImage.asset->url,
        bannerImage.asset->url,
        mainImage.asset->url,
        thumbnail.asset->url
      ),
      body,
      content
    }
  }`

  try {
    return await client.fetch(query, { slug }, { cache: 'no-store' })
  } catch (err) {
    console.error('Sanity case study fetch failed:', err)
    return { homepage: null, project: null }
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const src = getImageUrl(value)
      if (!src) return null
      return (
        <figure style={{ margin: '1.75rem 0' }}>
          <img
            src={src}
            alt={value?.alt || value?.caption || 'Case study visual'}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              borderRadius: '0.5rem',
            }}
          />
          {value?.caption && (
            <figcaption
              style={{
                marginTop: '0.6rem',
                fontSize: '0.8rem',
                color: '#8f8880',
                lineHeight: 1.5,
              }}
            >
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#f5f2ed',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          margin: '2.25rem 0 0.85rem',
        }}
      >
        {children}
      </h2>
    ),
    h2: ({ children }: any) => (
      <h2
        style={{
          fontSize: '1.4rem',
          fontWeight: 700,
          color: '#f5f2ed',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          margin: '2.25rem 0 0.8rem',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3
        style={{
          fontSize: '1.05rem',
          fontWeight: 600,
          color: '#e8e2da',
          lineHeight: 1.45,
          margin: '1.35rem 0 0.5rem',
        }}
      >
        {children}
      </h3>
    ),
    normal: ({ children }: any) => (
      <p
        style={{
          fontSize: '0.96rem',
          color: '#c7c0b7',
          lineHeight: 1.75,
          margin: '0 0 1rem',
        }}
      >
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote
        style={{
          margin: '1.5rem 0',
          padding: '0.2rem 0 0.2rem 1.15rem',
          borderLeft: '3px solid #9e978f',
          color: '#d8d1c8',
          fontSize: '0.95rem',
          fontStyle: 'italic',
          lineHeight: 1.7,
        }}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul
        style={{
          margin: '0.35rem 0 1.25rem',
          paddingLeft: '1.35rem',
          color: '#c7c0b7',
          fontSize: '0.95rem',
          lineHeight: 1.72,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol
        style={{
          margin: '0.35rem 0 1.25rem',
          paddingLeft: '1.35rem',
          color: '#c7c0b7',
          fontSize: '0.95rem',
          lineHeight: 1.72,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
        }}
      >
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ color: '#f5f2ed', fontWeight: 600 }}>{children}</strong>
    ),
    link: ({ value, children }: any) => {
      const href = value?.href || '#'
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          style={{
            color: '#f5f2ed',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            textDecorationColor: 'rgba(255, 255, 255, 0.35)',
          }}
        >
          {children}
        </a>
      )
    },
  },
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { project, homepage } = await getCaseStudyData(slug)

  if (!project) {
    notFound()
  }

  const coverUrl = project.heroImageUrl || project.thumbnailUrl
  const richContent = project.body || project.content

  const subtitleText =
    project.subtitle ||
    (Array.isArray(project.tags) && project.tags.length > 0
      ? project.tags.join(' • ')
      : project.description || '')

  const metaColumns = [
    { label: 'CLIENT', value: project.client || project.company },
    { label: 'INDUSTRY', value: project.industry },
    { label: 'ROLE', value: project.role },
    { label: 'PLATFORM', value: project.platform || project.period },
  ].filter((col) => Boolean(col.value)) as { label: string; value: string }[]

  const email = homepage?.email || 'arifkazi1989@gmail.com'
  const phone = homepage?.phone || '+91 7045045899'

  return (
    <div
      style={{
        backgroundColor: '#161412',
        color: '#f3f1ed',
        minHeight: '100vh',
        padding: '1.75rem 1.25rem 4.5rem',
      }}
    >
      <style>{`
        .df-top-nav {
          max-width: 56rem;
          margin: 0 auto 2.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #a8a198;
        }
        .df-top-link {
          color: #a8a198;
          text-decoration: none;
          transition: color 180ms ease;
        }
        .df-top-link:hover {
          color: #f5f2ed;
        }
        .df-container {
          max-width: 46rem;
          margin: 0 auto;
        }
        .df-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.25rem 1.5rem;
          padding: 1.75rem 0;
          border-top: 1px solid #2b2724;
          border-bottom: 1px solid #2b2724;
          margin-top: 2rem;
        }
        @media (min-width: 640px) {
          .df-meta-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .df-cta-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }
        .df-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.7rem 1.25rem;
          border-radius: 0.5rem;
          background-color: #221f1d;
          border: 1px solid #35302d;
          color: #e6e0d8;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 500;
          transition: border-color 180ms ease, background-color 180ms ease;
        }
        .df-cta-btn:hover {
          background-color: #292522;
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <header className="df-top-nav">
        <Link href="/" className="df-top-link">
          {'< Go Back'}
        </Link>
        <Link href="/#projects" className="df-top-link">
          Work
        </Link>
      </header>

      <main className="df-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
              fontWeight: 700,
              color: '#f5f2ed',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            {project.title}
          </h1>
          {subtitleText && (
            <p
              style={{
                fontSize: '0.92rem',
                color: '#a8a198',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {subtitleText}
            </p>
          )}
        </div>

        {coverUrl && (
          <img
            src={coverUrl}
            alt={project.title}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              marginTop: '1.75rem',
              borderRadius: '0.5rem',
            }}
          />
        )}

        {metaColumns.length > 0 && (
          <section className="df-meta-grid" aria-label="Project metadata">
            {metaColumns.map((col) => (
              <div key={col.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    letterSpacing: '0.09em',
                    color: '#8f8880',
                    textTransform: 'uppercase',
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#e8e2da',
                    lineHeight: 1.4,
                  }}
                >
                  {col.value}
                </span>
              </div>
            ))}
          </section>
        )}

        {richContent && (
          <article style={{ paddingTop: '0.5rem' }}>
            {Array.isArray(richContent) ? (
              <PortableText value={richContent} components={portableTextComponents} />
            ) : (
              <p
                style={{
                  fontSize: '0.96rem',
                  color: '#c7c0b7',
                  lineHeight: 1.75,
                  whiteSpace: 'pre-line',
                  margin: '1.5rem 0',
                }}
              >
                {String(richContent)}
              </p>
            )}
          </article>
        )}

        <hr
          style={{
            border: 'none',
            borderTop: '1px solid #2b2724',
            margin: '3rem 0 3.25rem',
          }}
        />

        <section style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontSize: '1.15rem',
              color: '#cfc8be',
              marginBottom: '0.85rem',
            }}
          >
            {homepage?.heroTitle?.replace(/^Hey,\s*I'm\s*/i, '') || 'Arif Kazi'}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
              fontWeight: 700,
              color: '#f5f2ed',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            Got a project in mind or just
            <br />
            curious? Let's talk.
          </h2>

          <div className="df-cta-row">
            <a href={`mailto:${email}`} className="df-cta-btn">
              <span>Copy mail</span>
              <span style={{ color: '#8f8880' }}>@</span>
            </a>
            <a href={`tel:${phone.replace(/\s+/g, '')}`} className="df-cta-btn">
              <span>Copy phone</span>
              <span style={{ color: '#8f8880' }}>☎</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}