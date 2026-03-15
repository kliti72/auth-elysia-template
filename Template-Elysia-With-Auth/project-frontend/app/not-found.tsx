
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 – Pagina non trovata | Versify',
  description: 'La pagina che stai cercando non esiste o è stata spostata. Torna alla home di Versify.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '404 – Pagina non trovata | Versify',
    description: 'La pagina che stai cercando non esiste o è stata spostata.',
    siteName: 'Versify',
  },
}

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#0f0f0f' }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {/* Purple glow top-left */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: '#8b7cf6' }}
        />
        {/* Green glow bottom-right */}
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#4ade80' }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#8b7cf6 1px, transparent 1px), linear-gradient(90deg, #8b7cf6 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

        {/* 404 big number */}
        <div className="relative mb-6 select-none">
          <span
            className="text-9xl font-bold leading-none tracking-tighter"
            style={{
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(135deg, #8b7cf6 0%, #4ade80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(139,124,246,0.4))',
            }}
          >
            404
          </span>
          {/* Decorative line under 404 */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-px w-32 opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, #8b7cf6, transparent)',
            }}
          />
        </div>

        {/* Heading */}
        <h1
          className="text-3xl font-bold mb-4 tracking-tight"
          style={{
            fontFamily: 'Georgia, serif',
            color: '#ffffff',
          }}
        >
          Questa pagina non esiste
        </h1>

        {/* Subtext */}
        <p
          className="text-base mb-10 leading-relaxed max-w-md"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          La pagina che stai cercando è stata spostata, eliminata o non è mai esistita.
          Niente paura — torna alla home e ricomincia da capo.
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="group relative inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm transition-all duration-300"
          style={{
            fontFamily: 'Inter, sans-serif',
            backgroundColor: '#8b7cf6',
            color: '#0f0f0f',
            boxShadow: '0 0 30px rgba(139,124,246,0.3)',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10 12L6 8l4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Torna alla home
        </Link>

        {/* Bottom decorative tag */}
        <p
          className="mt-16 text-xs tracking-widest uppercase opacity-20"
          style={{
            fontFamily: 'Inter, sans-serif',
            color: '#ffffff',
          }}
        >
          Versify — 404
        </p>
      </div>
    </main>
  )
}