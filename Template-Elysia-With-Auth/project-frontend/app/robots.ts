import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {

  return {
    rules: [
      {
        userAgent: '*',           // vale per tutti i bot
        allow: '/',               // permetti tutto di default
        disallow: [
          '/admin',               // area admin
          '/login',
          '/api',                 // di solito non va indicizzata
          '/_next',               // Next.js internals (già escluso ma per sicurezza)
          '/private/',
        ],
      },
      // Puoi aggiungere regole specifiche per bot particolari
      {
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: ['/', '/blog', '/poem', '/me', '/collection', '/silloge', '/*', '/blog/*', '/collection/*', '/profile/*', '/*/*/*/*', '/*/*/*', '/*/*'],
        disallow: '/admin',
      },
    ],

    // Molto importante per SEO: linka il sitemap
    sitemap: `https://versify.art/sitemap.xml`,

    // Opzionale: puoi aggiungere host se fai international SEO
    // host: baseUrl,
  }
}