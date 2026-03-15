// app/layout.tsx — aggiungi questo se vuoi lang dinamico
import { headers } from "next/headers";
import "./globals.css";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const lang = pathname.split("/")[1] ?? "it";

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}