'use client'

import { useState } from 'react'

export interface CareerEntry {
  role?: string
  company?: string
  period?: string
  description?: string
}

function ContinuousLadder() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '1.35rem',
        flexShrink: 0,
        alignSelf: 'stretch',
        marginTop: '0.45rem',
        marginBottom: '0.45rem',
        borderLeft: '2px solid #38322d',
        borderRight: '2px solid #38322d',
        backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 16px, #38322d 16px, #38322d 18px)',
        backgroundPosition: 'top left',
      }}
    />
  )
}

export default function CareerLadderSection({ items }: { items: CareerEntry[] }) {
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({})

  if (!items || items.length === 0) return null

  const toggleItem = (idx: number) => {
    setExpandedMap((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <section
      style={{
        backgroundColor: '#221f1d',
        borderRadius: '1.25rem',
        border: '1px solid #302c29',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <style>{`
        .career-entry-card {
          background-color: transparent;
          border: 1px solid transparent;
          border-radius: 0.95rem;
          padding: 0.9rem 1rem;
          transition: background-color 180ms ease, border-color 180ms ease;
          cursor: pointer;
        }
        .career-entry-card:hover,
        .career-entry-card:focus-visible {
          background-color: #2b2724;
          border-color: #423b36;
          outline: none;
        }
        .career-entry-card:hover .career-toggle-label,
        .career-entry-card:focus-visible .career-toggle-label {
          color: #e6dfd7;
        }
      `}</style>

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

      <div style={{ display: 'flex', alignItems: 'stretch', gap: '0.9rem' }}>
        <ContinuousLadder />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item, idx) => {
            const isExpanded = !!expandedMap[idx]
            const heading = [item.role, item.company].filter(Boolean).join(' @ ')

            return (
              <div
                key={`${heading}-${idx}`}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => toggleItem(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleItem(idx)
                  }
                }}
                className="career-entry-card"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f3f1ed' }}>
                    {heading}
                  </div>

                  {item.period && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#b5aea6',
                        backgroundColor: '#2d2926',
                        border: '1px solid #3c3632',
                        borderRadius: '999px',
                        padding: '0.2rem 0.65rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.period}
                    </span>
                  )}
                </div>

                {item.description && (
                  <>
                    <p
                      style={{
                        margin: '0.55rem 0 0',
                        fontSize: '0.875rem',
                        lineHeight: 1.65,
                        color: '#b5aea6',
                        whiteSpace: isExpanded ? 'pre-line' : 'normal',
                        ...(isExpanded
                          ? {}
                          : {
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }),
                      }}
                    >
                      {item.description}
                    </p>

                    <span
                      className="career-toggle-label"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        marginTop: '0.6rem',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: '#9e978f',
                        transition: 'color 180ms ease',
                      }}
                    >
                      {isExpanded ? 'View less' : 'View more'}
                      <span style={{ fontSize: '0.75rem' }}>{isExpanded ? '▴' : '▾'}</span>
                    </span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}