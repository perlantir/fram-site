# Deploy FRAM to Vercel (≈ 3 minutes)

Repo: https://github.com/perlantir/fram-site

You only need a browser — no CLI required.

## Where your secrets live

Two secrets — `AUTH_SECRET` and `BOOTSTRAP_TOKEN` — are stored in a **local, git-ignored file**:

```
~/Documents/Sauna/fram-site/.deploy-secrets.local
```

Never commit that file. It's already in `.gitignore`.

To regenerate them yourself:

```bash
node -e "console.log('AUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64')); console.log('BOOTSTRAP_TOKEN=' + require('crypto').randomBytes(24).toString('base64url'))"
```

## 1. Import the repo

1. Open https://vercel.com/new
2. Pick **perlantir/fram-site** from the repo list → **Import**
3. Framework preset: **Next.js** (auto-detected). Don't change build settings.
4. **Don't click Deploy yet** — add env vars first.

## 2. Provision Neon Postgres

1. In the import screen, open **Storage** → **Create Database** → **Neon Serverless Postgres**
2. Name it `fram-db` → Create
3. Vercel automatically injects `DATABASE_URL` (and Neon's other vars) into the project — you don't need to paste it.

## 3. Add these env vars

Open `.deploy-secrets.local` in your editor and paste each into Vercel's **Environment Variables**:

| name              | value                                  |
| ----------------- | -------------------------------------- |
| `AUTH_SECRET`     | (from `.deploy-secrets.local`)         |
| `BOOTSTRAP_TOKEN` | (from `.deploy-secrets.local`)         |
| `AUTH_TRUST_HOST` | `true`                                 |

Optional (skip for first deploy — the site works without them):

| name                             | value                              |
| -------------------------------- | ---------------------------------- |
| `RESEND_API_KEY`                 | your Resend API key                |
| `NOTIFY_EMAIL`                   | inquiries destination (your email) |
| `FROM_EMAIL`                     | `FRAM <no-reply@yourdomain.com>`   |
| `TURNSTILE_SECRET_KEY`           | Cloudflare Turnstile secret        |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key      |

## 4. Deploy

Click **Deploy**. First build takes ~90 seconds.

## 5. Run the database migration + seed (one-off)

From your terminal at `~/Documents/Sauna/fram-site`:

```bash
# Grab the DATABASE_URL Vercel provisioned:
#   Vercel dashboard → Storage → fram-db → .env.local → copy DATABASE_URL
export DATABASE_URL='postgres://…'   # paste it here
npm run db:migrate
npm run db:seed
```

That creates all tables and seeds the three FRAM saunas + 4 real research citations.

## 6. Create your admin account

Visit `https://<your-vercel-url>/admin/bootstrap` and paste:

- **Bootstrap token:** value from `.deploy-secrets.local`
- Your email + name
- A strong password (min 12 chars)

After the first admin exists, `/admin/bootstrap` refuses further requests.

## 7. Enroll TOTP 2FA (required for admins)

1. Sign in at `/admin/login`
2. Go to `/admin/users` → click your account → **Generate 2FA secret**
3. Scan the QR with Authy / 1Password / Google Authenticator
4. Enter the 6-digit code → **Confirm**

Next sign-in needs email + password + 6-digit code.

## Rotating secrets

Rotate anytime by regenerating (see top), updating in Vercel → Settings →
Environment Variables → redeploy.

## Troubleshooting

- **500 on public pages** — DB migration hasn't run. Do step 5.
- **Bootstrap says "disabled"** — an admin already exists. Sign in normally.
- **Sign-in fails silently for admin** — admin has no TOTP enrolled. Reset from another admin, or reseed with `BOOTSTRAP_ADMIN_EMAIL` + `BOOTSTRAP_ADMIN_PASSWORD` env vars and enroll 2FA.
