import CareerLadderSection from '@/components/CareerLadderSection'
import ContactSection from '@/components/ContactSection'
import { client } from '@/sanity/client'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const getHomeData = async () => {
  const query = `{
    "homepage": *[_type == "homepage"][0]{
      "profilePhotoUrl": profilePhoto.asset->url,
      heroTitle,
      heroBio,
      skills,
      storyPhotos[]{
        "url": asset->url,
        caption
      },
      storyQuote,
      careerEntries[]{
        role,
        company,
        period,
        description
      },
      email,
      phone,
      linkedinUrl,
      dribbbleUrl,
      mediumUrl
    },
    "projects": *[_type == "caseStudy"]{
      title,
      slug,
      description,
      "thumbnailUrl": thumbnail.asset->url,
      company,
      role
    }
  }`
  try {
    return await client.fetch(query, {}, { cache: 'no-store' })
  } catch (err) {
    console.error('Sanity fetch failed:', err)
    return { homepage: null, projects: [] }
  }
}

const DEFAULT_SKILLS = [
  'PRODUCT DESIGN',
  'INTERACTION DESIGN',
  'DESIGN SYSTEMS',
  'PRODUCT THINKING',
  'STORYTELLING',
  'PROTOTYPING',
]

export default async function Home() {
  const { homepage, projects } = await getHomeData()

  const heroTitle = homepage?.heroTitle || "Hey, I'm Arif"
  const heroBio =
    homepage?.heroBio ||
    'Design Leader & Mentor | IIT BHU Alum | 10+ YOE Leading design team in scaling Modular systems & Design ops. I bridge strategy and product launches with a focus on AI-driven interactive design. +91 7045045899 • arifkazi1989@gmail.com'
  const skills: string[] = homepage?.skills?.length ? homepage.skills : DEFAULT_SKILLS

  const careerItems = (homepage?.careerEntries || []).filter(
    (item: any) => item && (item.role || item.company || item.description)
  )

  return (
    <div style={{ backgroundColor: '#161412', color: '#f3f1ed', minHeight: '100vh', padding: '3.5rem 1.25rem' }}>
      <style>{`
        @keyframes skillsMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .skills-marquee-track {
          display: flex;
          width: max-content;
          animation: skillsMarquee 24s linear infinite;
        }
        .skills-marquee-wrapper:hover .skills-marquee-track {
          animation-play-state: paused;
        }
      `}</style>

      <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* 1. Hero + Skills Ticker Card */}
        <section style={{ backgroundColor: '#221f1d', borderRadius: '1.25rem', border: '1px solid #302c29', overflow: 'hidden' }}>
          <div style={{ padding: '2rem', display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div
              style={{
                position: 'relative',
                width: '6.5rem',
                height: '7.5rem',
                borderRadius: '0.875rem',
                backgroundColor: '#2e2a27',
                border: '1px solid #3d3834',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8c857e',
                fontSize: '0.75rem',
              }}
            >
              {homepage?.profilePhotoUrl ? (
                <Image
                  src={homepage.profilePhotoUrl}
                  alt={heroTitle}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <span>Photo</span>
              )}
            </div>

            {/* Bio */}
            <div style={{ flex: 1, minWidth: '16rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#f5f2ed', letterSpacing: '-0.02em', margin: 0 }}>
                {heroTitle}
              </h1>
              <p style={{ fontSize: '0.925rem', color: '#b5aea6', lineHeight: 1.6, margin: 0 }}>
                {heroBio}
              </p>
            </div>
          </div>

          {/* Skills Marquee Strip */}
          <div
            className="skills-marquee-wrapper"
            style={{
              borderTop: '1px solid #302c29',
              backgroundColor: '#1d1a18',
              padding: '0.75rem 0',
              overflow: 'hidden',
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#9e978f',
              whiteSpace: 'nowrap',
              maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            }}
          >
            <div className="skills-marquee-track">
              {[0, 1].map((loopIndex) => (
                <div
                  key={loopIndex}
                  aria-hidden={loopIndex === 1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    paddingRight: '1.5rem',
                  }}
                >
                  {skills.map((skill, idx) => (
                    <span
                      key={`${loopIndex}-${skill}-${idx}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '1.5rem' }}
                    >
                      <span>{skill}</span>
                      <span style={{ color: '#5c5650' }}>+</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Projects Section Card (2-Column Grid) */}
        <section style={{ backgroundColor: '#221f1d', borderRadius: '1.25rem', border: '1px solid #302c29', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', color: '#9e978f', textTransform: 'uppercase', margin: 0 }}>
            PROJECTS
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1.5rem' }}>
            {projects?.map((project: any) => (
              <Link
                key={project.slug.current}
                href={`/projects/${project.slug.current}`}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
              >
                <div style={{ position: 'relative', aspectRatio: '16/10', width: '100%', borderRadius: '0.875rem', overflow: 'hidden', backgroundColor: '#2d2926', border: '1px solid #36312e' }}>
                  {project.thumbnailUrl && (
                    <Image
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#f3f1ed', lineHeight: 1.35, margin: 0 }}>
                    {project.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#9e978f' }}>
                    {[project.company, project.role].filter(Boolean).join(' • ') || project.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Career Ladder Card */}
        <CareerLadderSection items={careerItems} />

        {/* 4. Contact Card */}
        <ContactSection
          email={homepage?.email}
          phone={homepage?.phone}
          linkedinUrl={homepage?.linkedinUrl}
          dribbbleUrl={homepage?.dribbbleUrl}
          mediumUrl={homepage?.mediumUrl}
        />

      </div>
    </div>
  )
}