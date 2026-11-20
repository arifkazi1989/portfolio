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
  linkedinUrl,
  dribbbleUrl,
  mediumUrl,
}: ContactSectionProps) {
  const [copiedKey, setCopiedKey] = useState<'email' | 'phone' | null>(null)

  const handleCopy = async (value: string, key: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800)
    } catch {
      // Clipboard access denied
    }
  }

  const socialLinks = [
    { label: 'LinkedIn', href: linkedinUrl },
    { label: 'Dribbble', href: dribbbleUrl },
    { label: 'Medium', href: mediumUrl },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href))

  return (
    <section
      style={{
        backgroundColor: '#221f1d',
        borderRadius: '1.25rem',
        border: '1px solid #302c29',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
      }}
    >
      <style>{`
        .contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .contact-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
          min-width: 0;
          padding: 0.85rem 1rem;
          border-radius: 0.85rem;
          background-color: #292522;
          border: 1px solid #38332f;
          color: #f3f1ed;
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          cursor: pointer;
          box-sizing: border-box;
          transition: background-color 160ms ease, border-color 160ms ease;
        }
        .contact-btn:hover,
        .contact-btn:focus-visible {
          background-color: #312c28;
          border-color: #4a433d;
          outline: none;
        }
        .contact-btn-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contact-btn-icon {
          color: #9e978f;
          flex-shrink: 0;
          line-height: 1;
        }
        @media (min-width: 640px) {
          .contact-list {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.75rem;
          }
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
        CONTACT
      </h2>

      <div className="contact-list">
        {email && (
          <button
            type="button"
            onClick={() => handleCopy(email, 'email')}
            className="contact-btn"
          >
            <span className="contact-btn-label">
              {copiedKey === 'email' ? 'Copied mail' : 'Copy mail'}
            </span>
            <span className="contact-btn-icon">@</span>
          </button>
        )}

        {phone && (
          <button
            type="button"
            onClick={() => handleCopy(phone, 'phone')}
            className="contact-btn"
          >
            <span className="contact-btn-label">
              {copiedKey === 'phone' ? 'Copied phone' : 'Copy phone'}
            </span>
            <span className="contact-btn-icon">☎</span>
          </button>
        )}

        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-btn"
          >
            <span className="contact-btn-label">{link.label}</span>
            <span className="contact-btn-icon">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}