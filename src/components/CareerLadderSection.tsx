'use client'

import { useState } from 'react'

interface CareerItem {
  role?: string
  company?: string
  period?: string
  description?: string
}

interface CareerLadderSectionProps {
  items?: CareerItem[]
}

export default function CareerLadderSection({ items = [] }: CareerLadderSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <section
      style={{
        backgroundColor: '#221f1d',
        borderRadius: '1.25rem',
        border: '1px solid #302c29',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}
    >
      <h2
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#9e978f',
          textTransform: 'uppercase',
          margin: 0,
        }}
      >
        CAREER LADDER
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
        {/* Left Vertical Ladder Graphic */}
        <div
          aria-hidden="true"
          style={{
            width: '1.5rem',
            flexShrink: 0,
            borderLeft: '2px solid #3d3834',
            borderRight: '2px solid #3d3834',
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 18px, #3d3834 18px, #3d3834 20px)',
            marginTop: '0.25rem',
            marginBottom: '0.25rem',
          }}
        />

        {/* Right Career Entries */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {items.map((item, idx) => {
            const isExpanded = expandedIndex === idx
            const text = item.description?.trim() || ''
            const canExpand = text.length > 140 || text.includes('\n')

            return (
              <div key={`${item.company}-${idx}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {/* Header Row: Role @ Company + Date Pill */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <h3 style={{ fontSize: '0.975rem', fontWeight: 600, color: '#f3f1ed', margin: 0 }}>
                    {[item.role, item.company].filter(Boolean).join(' @ ')}
                  </h3>

                  {item.period && (
                    <span
                      style={{
                        backgroundColor: '#2c2825',
                        border: '1px solid #3a3531',
                        color: '#b5aea6',
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '999px',
                      }}
                    >
                      {item.period}
                    </span>
                  )}
                </div>

                {/* Single Description (Clamped to 2 lines until expanded) */}
                {text && (
                  <p
                    style={
                      isExpanded
                        ? {
                            fontSize: '0.875rem',
                            color: '#b5aea6',
                            lineHeight: 1.65,
                            margin: 0,
                            whiteSpace: 'pre-line',
                          }
                        : {
                            fontSize: '0.875rem',
                            color: '#a8a199',
                            lineHeight: 1.6,
                            margin: 0,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }
                    }
                  >
                    {text}
                  </p>
                )}

                {/* View More / View Less Toggle */}
                {canExpand && (
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: '#9e978f',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.15rem',
                    }}
                  >
                    <span>{isExpanded ? 'View less' : 'View more'}</span>
                    <span style={{ fontSize: '0.7rem' }}>{isExpanded ? '▴' : '▾'}</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}