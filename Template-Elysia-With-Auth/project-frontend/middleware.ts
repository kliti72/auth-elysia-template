import { NextRequest, NextResponse } from "next/server";

const LOCALES = ["it", "en", "fr", "es", "pt", "de"];
const DEFAULT = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignora _next, api, file statici, audio
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/audio") ||
    /\.(.*)$/.test(pathname)
  ) return NextResponse.next();

  // ha già un locale valido → lascia passare
  const hasLocale = LOCALES.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // detect lingua dal browser
  const accepted = req.headers.get("accept-language") ?? "";
  const preferred = accepted.split(",")[0]?.split("-")[0]?.toLowerCase() ?? "";
  const cookieLang = req.cookies.get("lang")?.value
  const browserLang = req.headers.get("accept-language")
    ?.split(",")[0]?.split("-")[0]?.toLowerCase()
  const locale = LOCALES.includes(cookieLang ?? "")
    ? cookieLang
    : LOCALES.includes(browserLang ?? "")
      ? browserLang
      : DEFAULT
  // redirect → /it/... oppure /en/...
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === "/" ? "" : pathname}`, req.url)
  );
}

export const config = {
  matcher: ["/((?!_next|api|audio|.*\\..*).*)"],
};