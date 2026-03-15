import { MetadataRoute } from "next";

const baseUrl = "https://versify.art";
const locales = ["it", "en", "fr", "es", "pt", "de"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/silloge", "/auth"];

  console.log("[Sitemap] 🚀 Generazione avviata");
  console.log("[Sitemap] 🌐 API URL →", process.env.NEXT_PUBLIC_API_URL);

  // pagine statiche
  const staticPages = locales.flatMap((lang) =>
    staticRoutes.map((route) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );
  console.log("[Sitemap] ✅ Static pages →", staticPages.length);
  return staticPages;
}