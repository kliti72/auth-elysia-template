import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 – Pagina non trovata | Versify',
  description: 'La pagina che stai cercando non esiste o è stata spostata.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-center px-6">
      <span className="text-9xl font-bold" style={{ fontFamily: 'Georgia, serif', background: 'linear-gradient(135deg, #8b7cf6, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        404
      </span>
      <h1 className="text-3xl text-white mt-4 mb-3" style={{ fontFamily: 'Georgia, serif' }}>Questa pagina non esiste</h1>
      <p className="text-sm text-white/40 max-w-sm leading-relaxed mb-8">
        La pagina è stata spostata, eliminata o non è mai esistita.
      </p>
      <Link href="/" className="px-8 py-3 rounded-full bg-[#8b7cf6] text-[#0f0f0f] text-sm font-medium">
        ← Torna alla home
      </Link>
    </main>
  )
}