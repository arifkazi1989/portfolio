import { client } from '@/sanity/client'
import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

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

const isCompactImage = (value: any) => {
  if (!value || typeof value !== 'object') return false

  const booleanKeys = ['compact', 'isCompact', 'small', 'isSmall', 'narrow']
  for (const key of booleanKeys) {
    if (value[key] === true) return true
  }

  const stringKeys = ['size', 'layout', 'width', 'widthMode', 'display', 'variant', 'style']
  for (const key of stringKeys) {
    const raw = value[key]
    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase()
      if (['compact', 'small', 'narrow', 'mobile', 'portrait'].includes(normalized)) {
        return true
      }
    }
  }

  return false
}

const formatMetaValue = (val: any): string | null => {
  if (!val) return null
  if (Array.isArray(val)) {
    const joined = val.filter(Boolean).join(', ')
    return joined || null
  }
  return String(val)
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
      sector,
      role,
      platform,
      platforms,
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
      const compact = isCompactImage(value)

      return (
        <figure
          style={{
            margin: '2rem auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img
            src={src}
            alt={value?.alt || value?.caption || 'Case study visual'}
            style={{
              display: 'block',
              margin: '0 auto',
              width: compact ? 'auto' : '100%',
              maxWidth: compact ? '21rem' : '100%',
              maxHeight: compact ? '31rem' : 'none',
              height: 'auto',
              borderRadius: '0.5rem',
            }}
          />
          {value?.caption && (
            <figcaption
              style={{
                marginTop: '0.65rem',
                fontSize: '0.88rem',
                color: '#8f8880',
                lineHeight: 1.5,
                textAlign: 'center',
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
          fontSize: '1.7rem',
          fontWeight: 600,
          color: '#F0EDE7',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          margin: '2.4rem 0 0.8rem',
        }}
      >
        {children}
      </h2>
    ),
    h2: ({ children }: any) => (
      <h2
        style={{
          fontSize: '1.6rem',
          fontWeight: 600,
          color: '#F0EDE7',
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          margin: '2.25rem 0 0.75rem',
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3
        style={{
          fontSize: '1.18rem',
          fontWeight: 600,
          color: '#F0EDE7',
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
          fontSize: '1.06rem',
          color: '#d8d2ca',
          lineHeight: 1.65,
          margin: '0 0 0.95rem',
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
          color: '#dcd6ce',
          fontSize: '1.06rem',
          fontStyle: 'italic',
          lineHeight: 1.65,
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
          margin: '0.35rem 0 1.2rem',
          paddingLeft: '1.4rem',
          color: '#d8d2ca',
          fontSize: '1.04rem',
          lineHeight: 1.62,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.42rem',
        }}
      >
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol
        style={{
          margin: '0.35rem 0 1.2rem',
          paddingLeft: '1.4rem',
          color: '#d8d2ca',
          fontSize: '1.04rem',
          lineHeight: 1.62,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.42rem',
        }}
      >
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ color: '#F0EDE7', fontWeight: 600 }}>{children}</strong>
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
            color: '#F0EDE7',
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
    {
      label: 'CLIENT',
      value: formatMetaValue(project.client || project.company),
    },
    {
      label: 'INDUSTRY',
      value: formatMetaValue(project.industry || project.sector),
    },
    {
      label: 'ROLE',
      value: formatMetaValue(project.role),
    },
    {
      label: 'PLATFORM',
      value: formatMetaValue(project.platform || project.platforms),
    },
  ].filter((col): col is { label: string; value: string } => Boolean(col.value))

  const email = homepage?.email || 'arifkazi1989@gmail.com'
  const phone = homepage?.phone || '+91 7045045899'

  return (
    <div
      className={inter.className}
      style={{
        backgroundColor: '#161412',
        color: '#F0EDE7',
        minHeight: '100vh',
        padding: '0 2rem 5rem',
      }}
    >
      <style>{`
        .df-header-wrap {
          border-bottom: 1px solid #262220;
          margin-bottom: 2.5rem;
        }
        .df-top-nav {
          max-width: 56rem;
          margin: 0 auto;
          padding: 1.35rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.92rem;
          color: #a8a198;
        }
        .df-top-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #a8a198;
          text-decoration: none;
          transition: color 180ms ease;
        }
        .df-top-link:hover {
          color: #F0EDE7;
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
          border-bottom: 1px solid #2b2724;
          margin-top: 1.75rem;
          margin-bottom: 1.5rem;
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
          gap: 0.85rem;
          margin-top: 1.6rem;
        }
        .df-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.75rem 1.35rem;
          border-radius: 0.5rem;
          background-color: #221f1d;
          border: 1px solid #35302d;
          color: #e6e0d8;
          text-decoration: none;
          font-size: 0.92rem;
          font-weight: 500;
          transition: border-color 180ms ease, background-color 180ms ease;
        }
        .df-cta-btn:hover {
          background-color: #292522;
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <div className="df-header-wrap">
        <header className="df-top-nav">
          <Link href="/" className="df-top-link">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Go Back</span>
          </Link>
          <Link href="/#projects" className="df-top-link">
            Work
          </Link>
        </header>
      </div>

      <main className="df-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <h1
            style={{
              fontFamily: inter.style.fontFamily,
              fontSize: '28px',
              fontWeight: 600,
              color: '#F0EDE7',
              letterSpacing: '-0.56px',
              lineHeight: '35px',
              margin: 0,
            }}
          >
            {project.title}
          </h1>
          {subtitleText && (
            <p
              style={{
                fontSize: '1.02rem',
                color: '#a8a198',
                lineHeight: 1.55,
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
              margin: '1.85rem auto 0',
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
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
                    fontSize: '0.74rem',
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
                    fontSize: '1rem',
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
                  fontSize: '1.06rem',
                  color: '#d8d2ca',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-line',
                  margin: '1.25rem 0',
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
            margin: '3.25rem 0 3.25rem',
          }}
        />

        <section style={{ textAlign: 'center', padding: '0.5rem 0 1rem' }}>
          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              color: '#cfc8be',
              marginBottom: '0.85rem',
            }}
          >
            {homepage?.heroTitle?.replace(/^Hey,\s*I'm\s*/i, '') || 'Arif Kazi'}
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3.2vw, 2.1rem)',
              fontWeight: 600,
              color: '#F0EDE7',
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