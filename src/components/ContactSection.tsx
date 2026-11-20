'use client'

import { useState } from 'react'

interface ContactSectionProps {
  email?: string
  phone?: string
  linkedinUrl?: string
  dribbbleUrl?: string
  mediumUrl?: string
}

export default function ContactSection({
  email = 'arifkazi1989@gmail.com',
  phone = '+91 7045045899',
  linkedinUrl = 'https://www.linkedin.com',
  dribbbleUrl = 'https://dribbble.com',
  mediumUrl = 'https://medium.com',
}: ContactSectionProps) {
  const [copiedField, setCopiedField] = useState<'email' | 'phone' | null>(null)

  const handleCopy = async (text: string, field: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      // Fallback ignored
    }
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#1d1a18',
    border: '1px solid #302c29',
    borderRadius: '0.75rem',
    padding: '0.9rem 1.15rem',
    color: '#e6e2dc',
    fontSize: '0.85rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    textDecoration: 'none',
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
        gap: '1rem',
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
        CONTACT
      </h2>

      {/* Top Row: Copy Mail & Copy Phone */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => handleCopy(email, 'email')}
          style={buttonStyle}
        >
          <span>{copiedField === 'email' ? 'Copied email!' : 'Copy mail'}</span>
          <span style={{ color: '#8c857e', fontSize: '0.95rem' }}>@</span>
        </button>

        <button
          type="button"
          onClick={() => handleCopy(phone, 'phone')}
          style={buttonStyle}
        >
          <span>{copiedField === 'phone' ? 'Copied phone!' : 'Copy phone'}</span>
          <span style={{ color: '#8c857e', fontSize: '0.95rem' }}>✆</span>
        </button>
      </div>

      {/* Bottom Row: Social Links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
          <span>LinkedIn</span>
          <span style={{ color: '#8c857e', fontSize: '0.9rem' }}>↗</span>
        </a>

        <a href={dribbbleUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
          <span>Dribbble</span>
          <span style={{ color: '#8c857e', fontSize: '0.9rem' }}>↗</span>
        </a>

        <a href={mediumUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>
          <span>Medium</span>
          <span style={{ color: '#8c857e', fontSize: '0.9rem' }}>↗</span>
        </a>
      </div>
    </section>
  )
}