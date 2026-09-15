# FRAM — website + admin

Editorial Nordic residential sauna site with a hardened admin panel.
Built on Next.js 15 (App Router), Postgres via Drizzle, NextAuth v5,
Tailwind v4, and argon2 password hashing with TOTP 2FA.

## What's inside

Public site
- `/` — A Nordic Experience homepage
- `/saunas` — index of models
- `/saunas/[slug]` — product detail (FRAM 01 / 02 / 03) with specs, price tiers,
  floor plan, elevation, expandable details, downloadable spec sheet
- `/evidence` — peer-reviewed research library, grouped by category
- `/inquire` — secure inquiry form (Zod validation, honeypot, Turnstile, rate-limited)

Admin panel — `/admin`
- Dashboard with counts + recent activity
- Products CRUD (specs + details JSON + hero/plan/elevation, price tiers)
- Inquiries pipeline (status, notes, reply-by-email)
- Evidence CRUD (categorized citations)
- Users + roles (admin / editor / viewer), disable, password reset
- TOTP 2FA enrollment (QR + manual), rotation, disable
- Audit log with search
- Settings

Security
- Argon2id password hashing
- TOTP 2FA (enforced for admins)
- Failed-login lockout (5 attempts → 15 minute lock)
- `__Host-` prefixed session cookie, `httpOnly`, `sameSite=lax`, `secure` in prod
- Middleware-emitted CSP with per-request nonce, HSTS, `X-Frame-Options`,
  `Permissions-Policy`, `Referrer-Policy`, `X-Content-Type-Options`
- Zod validation on every form + action; RBAC checks in every server action
- Rate limiting on inquiry submissions
- Honeypot field + optional Cloudflare Turnstile
- Structured audit log for every mutation
- Bootstrap route auto-disables after first admin is created

## Setup

```bash
cp .env.example .env.local
# fill in DATABASE_URL, AUTH_SECRET, BOOTSTRAP_TOKEN, etc.

npm install
npm run db:generate    # create migration from schema
npm run db:migrate     # apply
npm run db:seed        # optional — seeds FRAM 01/02/03 + evidence citations

# create the first admin
BOOTSTRAP_ADMIN_EMAIL=you@example.com \
  BOOTSTRAP_ADMIN_PASSWORD='a-strong-password' \
  npm run db:seed
# — OR — start the dev server and visit /admin/bootstrap

npm run dev
```

Then:
1. Open `http://localhost:3000` — public site
2. Open `http://localhost:3000/admin/login` — sign in
3. First-time admin: enroll TOTP from `/admin/users/[you]` before signing out

## Environment

| var                            | required | notes                             |
| ------------------------------ | -------- | --------------------------------- |
| DATABASE_URL                   | yes      | Postgres URL                       |
| AUTH_SECRET                    | yes      | 32+ bytes random                   |
| AUTH_URL                       | prod     | Public URL of the site             |
| AUTH_TRUST_HOST                | prod     | `true` behind a proxy              |
| BOOTSTRAP_TOKEN                | first run| Required for `/admin/bootstrap`    |
| RESEND_API_KEY                 | optional | Emails logged if unset             |
| NOTIFY_EMAIL                   | optional | Inquiry destination                |
| FROM_EMAIL                     | optional | Verified sender in Resend          |
| TURNSTILE_SECRET_KEY           | optional | Enables spam check                 |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | optional | Client widget                      |

## Scripts

```
npm run dev         # dev server
npm run build       # production build
npm run start       # production server
npm run typecheck   # tsc
npm run db:generate # generate migration
npm run db:migrate  # apply migrations
npm run db:seed     # seed products + citations
npm run db:studio   # drizzle studio
```

## Deploying to Vercel

1. Create a Postgres database (Vercel Postgres or Neon) and copy its URL.
2. `vercel env add DATABASE_URL AUTH_SECRET BOOTSTRAP_TOKEN NOTIFY_EMAIL RESEND_API_KEY ...`
3. `vercel deploy --prod`
4. From the deployed URL run `POST /api/auth/session` once to warm auth,
   then visit `/admin/bootstrap` to create the first admin.

## Notes

- FRAM logo assets live in `/public/logos/`. The wordmark is a scalable SVG
  that inherits `currentColor` — recolor with CSS.
- Product plans are inline SVG (`/public/plans/*.svg`) — replace with your own
  drawings via the admin Products form (Plan / Elevation URL fields).
- Product hero images are placeholders; upload real photography and set
  the `Hero image URL` on each product.
