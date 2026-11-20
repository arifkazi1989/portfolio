import { client } from '@/sanity/client'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

const IMAGE_MAX_WIDTH: Record<'compact' | 'medium' | 'default', string> = {
  compact: '22rem',
  medium: '38rem',
  default: '100%',
}

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ffffff', marginTop: '2.5rem', marginBottom: '1rem', lineHeight: 1.25 }}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#f4f4f5', marginTop: '2rem', marginBottom: '0.75rem', lineHeight: 1.3 }}>
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p style={{ fontSize: '1.05rem', color: '#d4d4d8', lineHeight: 1.75, marginBottom: '1.25rem' }}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '3px solid #818cf8', paddingLeft: '1rem', margin: '1.5rem 0', color: '#a1a1aa', fontStyle: 'italic' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1.25rem', color: '#d4d4d8', lineHeight: 1.75 }}>
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1.25rem', color: '#d4d4d8', lineHeight: 1.75 }}>
        {children}
      </ol>
    ),
  },
  types: {
    image: ({
      value,
    }: {
      value: {
        asset?: { url?: string; metadata?: { dimensions?: { width?: number; height?: number } } }
        alt?: string
        caption?: string
        width?: 'compact' | 'medium' | 'default'
      }
    }) => {
      const url = value?.asset?.url
      if (!url) return null

      const naturalWidth = value?.asset?.metadata?.dimensions?.width || 1200
      const naturalHeight = value?.asset?.metadata?.dimensions?.height || 800
      const widthKey = value?.width || 'default'
      const maxWidth = IMAGE_MAX_WIDTH[widthKey] || IMAGE_MAX_WIDTH.default

      return (
        <figure style={{ margin: '2rem auto', maxWidth, width: '100%' }}>
          <div style={{ width: '100%', borderRadius: '0.875rem', overflow: 'hidden', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
            <Image
              src={url}
              alt={value.alt || 'Case study image'}
              width={naturalWidth}
              height={naturalHeight}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          {value.caption && (
            <figcaption style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.5rem', textAlign: 'center' }}>
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

const getProject = cache(async (slug: string) => {
  const query = `*[_type == "caseStudy" && slug.current == $slug][0]{
    title,
    description,
    "thumbnailUrl": thumbnail.asset->url,
    company,
    role,
    timeline,
    metrics,
    figmaUrl,
    isProtected,
    password,
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      }
    }
  }`
  return client.fetch(query, { slug }, { cache: 'no-store' })
})

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)

  if (!project) {
    notFound()
  }

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', padding: '4rem 1.5rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Top Back Navigation */}
        <Link 
          href="/" 
          style={{ fontSize: '0.875rem', color: '#a1a1aa', textDecoration: 'none' }}
        >
          ← Back to Portfolio
        </Link>

        {/* Project Header & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ffffff', lineHeight: 1.1 }}>
            {project.title}
          </h1>
          {project.description && (
            <p style={{ fontSize: '1.25rem', color: '#a1a1aa', maxWidth: '42rem', lineHeight: 1.6 }}>
              {project.description}
            </p>
          )}
        </div>

        {/* Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1.5rem', padding: '1.5rem 0', borderTop: '1px solid #27272a', borderBottom: '1px solid #27272a', fontSize: '0.875rem' }}>
          {project.company && (
            <div>
              <span style={{ display: 'block', color: '#71717a', marginBottom: '0.25rem' }}>Company</span>
              <span style={{ fontWeight: 500, color: '#e4e4e7' }}>{project.company}</span>
            </div>
          )}
          {project.role && (
            <div>
              <span style={{ display: 'block', color: '#71717a', marginBottom: '0.25rem' }}>Role</span>
              <span style={{ fontWeight: 500, color: '#e4e4e7' }}>{project.role}</span>
            </div>
          )}
          {project.timeline && (
            <div>
              <span style={{ display: 'block', color: '#71717a', marginBottom: '0.25rem' }}>Timeline</span>
              <span style={{ fontWeight: 500, color: '#e4e4e7' }}>{project.timeline}</span>
            </div>
          )}
        </div>

        {/* Cover Image */}
        {project.thumbnailUrl && (
          <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', borderRadius: '1rem', overflow: 'hidden', backgroundColor: '#18181b', border: '1px solid #27272a' }}>
            <Image 
              src={project.thumbnailUrl} 
              alt={project.title} 
              fill 
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}

        {/* Impact Metrics Row */}
        {project.metrics && project.metrics.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
            {project.metrics.map((metric: any, index: number) => (
              <div key={index} style={{ padding: '1.5rem', borderRadius: '1rem', backgroundColor: 'rgba(24, 24, 27, 0.6)', border: '1px solid #27272a' }}>
                <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#818cf8', marginBottom: '0.25rem' }}>{metric.stat}</div>
                <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{metric.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Rich Case Study Body */}
        {project.body && project.body.length > 0 && (
          <article style={{ paddingTop: '0.5rem' }}>
            <PortableText value={project.body} components={portableTextComponents} />
          </article>
        )}

        {/* Figma Prototype Embed */}
        {project.figmaUrl && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#e4e4e7' }}>Interactive Prototype</h3>
            <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #27272a', backgroundColor: '#18181b' }}>
              <iframe 
                src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(project.figmaUrl)}`}
                allowFullScreen
                style={{ width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}