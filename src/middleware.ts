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

const SESSION_COOKIE = "__Host-fram.session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const n = nonce();
  const isProd = process.env.NODE_ENV === "production";

  // Admin auth guard: any /admin/* route except the public ones below
  // must have a session cookie. Full role check + user lookup still runs
  // server-side in each protected page/action.
  if (pathname.startsWith("/admin") && !PUBLIC_ADMIN_PATHS.has(pathname)) {
    const hasSession =
      req.cookies.get(SESSION_COOKIE) ??
      req.cookies.get("next-auth.session-token") ??
      req.cookies.get("__Secure-next-auth.session-token") ??
      req.cookies.get("authjs.session-token") ??
      req.cookies.get("__Secure-authjs.session-token");
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  const csp = [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `style-src 'self' 'unsafe-inline'`,
    `script-src 'self' 'nonce-${n}' ${isProd ? "" : "'unsafe-eval'"} https://challenges.cloudflare.com`,
    `frame-src https://challenges.cloudflare.com`,
    `connect-src 'self' https://challenges.cloudflare.com`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", n);

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
