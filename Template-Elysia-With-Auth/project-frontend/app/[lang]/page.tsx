// app/[lang]/page.tsx
import type { Metadata } from "next";
import { getT, Locale, LOCALES } from "./i18n/translations";
import Link from "next/link";

/* ─── SEO ────────────────────────────────────────────────── */
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang);
  return {
    title:       t.meta_title,
    description: t.meta_description,
    keywords:    ["poetry", "poems", "creative writing", "poets", "verse", "literature"],
    authors:     [{ name: "Versify" }],
    metadataBase: new URL("https://versify.art"),
    alternates: {
      canonical: `https://versify.art/${lang}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `https://versify.art/${l}`])),
    },
    openGraph: {
      title:       t.meta_title,
      description: t.meta_description,
      url:         `https://versify.art/${lang}`,
      siteName:    "Versify",
      images:      [{ url: "/og-image.jpg", width: 1200, height: 630, alt: t.meta_title }],
      locale:      lang,
      type:        "website",
    },
    twitter: {
      card:        "summary_large_image",
      title:       t.meta_title,
      description: t.meta_description,
      images:      ["/og-image.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

/* ─── DATA ───────────────────────────────────────────────── */
const POEM_CARDS = [
  {
    id: 1, author: "Elena Vasquez", handle: "@elenav", lang: "ES", time: "2m",
    title: "Lluvia de Marzo",
    excerpt: "La lluvia cae suave\nsobre mis recuerdos rotos,\ncada gota un verso...",
    likes: 142, tags: ["#nature", "#spanish"],
    style: { top: "12%", right: "-5%", rotate: "2deg", delay: "0s", duration: "4s" },
  },
  {
    id: 2, author: "Marco Bellini", handle: "@marcob", lang: "IT", time: "11m",
    title: "Alba Silenziosa",
    excerpt: "Nel silenzio dell'alba\nle stelle si congedano,\nuna ad una, come parole...",
    likes: 89, tags: ["#dawn", "#italiano"],
    style: { top: "45%", right: "-8%", rotate: "-1.5deg", delay: "1.5s", duration: "5.5s" },
  },
  {
    id: 3, author: "Aisha Ndiaye", handle: "@aishapoet", lang: "EN", time: "34m",
    title: "Between Tides",
    excerpt: "I learned to love\nin the space between waves—\nbrief, relentless, salt.",
    likes: 211, tags: ["#haiku", "#ocean"],
    style: { top: "72%", right: "-3%", rotate: "1deg", delay: "0.8s", duration: "4.8s" },
  },
];

const STATS = (t: Record<string, string>) => [
];

/* ─── PAGE ───────────────────────────────────────────────── */
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale   = LOCALES.includes(lang as Locale) ? lang : "en";
  const t        = getT(locale);

  return (
    <>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type":    "WebSite",
            name:        "Versify",
            url:         "https://versify.art",
            description: t.meta_description,
            potentialAction: {
              "@type":       "SearchAction",
              target:        `https://versify.art/${locale}/silloge?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      <main className="relative max-h-screen overflow-hidden">
        <Hero t={t} lang={locale} />
      </main>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero({ t, lang }: { t: Record<string, string>; lang: string }) {
  return (

    <section aria-label="Hero" className="relative z-10 min-h-screen flex items-center px-6">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="flex flex-col gap-8">


          {/* H1 */}
          <h1 className="fu" style={{ fontFamily: "Georgia, serif", animationDelay: "0.2s" }}>
            <span className="block text-5xl sm:text-6xl lg:text-7xl text-white font-normal leading-tight tracking-tight">
              {t.h1a}
            </span>
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-normal leading-tight tracking-tight bg-gradient-to-r from-[#8b7cf6] via-[#a78bfa] to-[#4ade80] bg-clip-text text-transparent">
              {t.h1b}
            </span>
          </h1>

          {/* SUB */}
          <p className="fu text-lg text-[#888] leading-relaxed max-w-md" style={{ animationDelay: "0.35s" }}>
            {t.sub}
          </p>

          {/* CTA */}

          <div className="fu flex flex-col sm:flex-row gap-4" style={{ animationDelay: "0.5s" }}>
            <Link
              href={`/${lang}/editor/write`}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#8b7cf6] to-[#6d5ce7] text-white text-sm tracking-widest uppercase hover:opacity-90 hover:scale-105 transition-all duration-300"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              <span>✦</span> {t.cta_primary}
            </Link>
            <Link
              href={`/${lang}/silloge`}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white/70 text-sm tracking-widest uppercase hover:border-white/30 hover:text-white transition-all duration-300"
            >
              {t.cta_secondary} <span className="text-[#4ade80]">→</span>
            </Link>
          </div>

          {/* STATS */}
          <div className="fu flex gap-8 pt-4 border-t border-white/5" style={{ animationDelay: "0.65s" }}>
            {STATS(t).map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-normal text-white" style={{ fontFamily: "Georgia, serif" }}>
                  {value}
                </span>
                <span className="text-xs tracking-widest uppercase text-[#555]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating cards */}
        <div className="relative hidden lg:block h-[600px]" aria-hidden="true">
          {POEM_CARDS.map((card) => (
            <article
              key={card.id}
              className="card-float absolute w-72 bg-[#111]/90 backdrop-blur-sm border border-white/[0.08] rounded-2xl p-5 shadow-2xl"
              style={{
                top:              card.style.top,
                right:            card.style.right,
                transform:        `rotate(${card.style.rotate})`,
                animationDelay:   card.style.delay,
                animationDuration: card.style.duration,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8b7cf6] to-[#4ade80] flex items-center justify-center text-white text-xs">
                    {card.author[0]}
                  </div>
                  <div>
                    <p className="text-white text-xs leading-none">{card.author}</p>
                    <p className="text-[#555] text-[10px] mt-0.5">{card.handle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#8b7cf6]/20 text-[#8b7cf6] text-[9px] tracking-widest uppercase">
                    {card.lang}
                  </span>
                  <span className="text-[#444] text-[10px]">{card.time}</span>
                </div>
              </div>

              <h3 className="text-white text-sm font-normal mb-2" style={{ fontFamily: "Georgia, serif" }}>
                {card.title}
              </h3>
              <p className="text-[#666] text-xs leading-relaxed whitespace-pre-line mb-3" style={{ fontFamily: "Georgia, serif" }}>
                {card.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {card.tags.map(tag => (
                    <span key={tag} className="text-[#4ade80] text-[10px]">{tag}</span>
                  ))}
                </div>
                <span className="text-[#555] text-[10px]">♥ {card.likes}</span>
              </div>
            </article>
          ))}

          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <line x1="80%" y1="20%" x2="70%" y2="55%" stroke="#8b7cf6" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="70%" y1="55%" x2="75%" y2="80%" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="4 4" />
          </svg>
        </div>

      </div>
    </section>
  );
}