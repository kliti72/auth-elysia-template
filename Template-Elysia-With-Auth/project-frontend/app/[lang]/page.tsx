import type { Metadata } from "next";
import { getT, LOCALES } from "./i18n/translations";

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang);
  return {
    title:       `${t.app_name} - Welcome`,
    description: "This is a template.",
    keywords:    ["example"],
    authors:     [{ name: t.app_name }],
    metadataBase: new URL(`https://${t.app_name}.${t.app_domain}`),
    alternates: {
      canonical: `https://${t.app_name}.${t.app_domain}/${lang}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `https://${t.app_name}.${t.app_domain}/${l}`])),
    },
    openGraph: {
      title:       t.meta_title,
      description: t.meta_description,
      url:         `https://${t.app_name}.${t.app_domain}/${lang}`,
      siteName:    t.app_name,
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

export default function Hero() {
  return (
    <section aria-label="Hero">
      <div> Hello World </div>
    </section>
  );
}