import { NextResponse, type NextRequest } from "next/server";

function nonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

const PUBLIC_ADMIN_PATHS = new Set([
  "/admin/login",
  "/admin/bootstrap",
]);

const SESSION_COOKIE_CANDIDATES = [
  "__Host-fram.session",
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const n = nonce();
  const isProd = process.env.NODE_ENV === "production";

  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const hasSession = SESSION_COOKIE_CANDIDATES.some((c) => req.cookies.get(c));
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Practical CSP for Next.js App Router: allow inline scripts (Next emits
  // many SSR hydration scripts and doesn't reliably nonce them). Everything
  // else stays locked down: no eval in prod, restricted origins, no iframes,
  // etc.
  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `style-src 'self' 'unsafe-inline'`,
    `script-src 'self' 'unsafe-inline' ${isProd ? "" : "'unsafe-eval'"} https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `connect-src 'self' https://challenges.cloudflare.com`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", n);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  if (isProd) {
    res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|logos|images|plans|robots.txt|sitemap.xml).*)",
  ],
};
