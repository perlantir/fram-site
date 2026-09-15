import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();
  return (
    <div>
      <p className="kicker kicker-muted">Configuration.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2.5rem" }}>
        Settings.
      </h1>

      <section className="max-w-2xl border rule p-6">
        <p className="kicker kicker-muted">Account</p>
        <dl className="mt-4 grid grid-cols-[9rem_1fr] gap-y-3 text-sm">
          <dt className="text-[color:var(--color-muted)]">Signed in as</dt>
          <dd>{session?.user?.email}</dd>
          <dt className="text-[color:var(--color-muted)]">Role</dt>
          <dd>{(session?.user as { role?: string })?.role}</dd>
        </dl>
      </section>

      <section className="mt-8 max-w-2xl border rule p-6">
        <p className="kicker kicker-muted">Environment</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <strong className="text-[color:var(--color-muted)] mr-3 text-[11px] uppercase tracking-[0.14em]">
              Node env
            </strong>
            {process.env.NODE_ENV}
          </li>
          <li>
            <strong className="text-[color:var(--color-muted)] mr-3 text-[11px] uppercase tracking-[0.14em]">
              Email
            </strong>
            {process.env.RESEND_API_KEY ? "Configured (Resend)" : "Dev / logged only"}
          </li>
          <li>
            <strong className="text-[color:var(--color-muted)] mr-3 text-[11px] uppercase tracking-[0.14em]">
              Turnstile
            </strong>
            {process.env.TURNSTILE_SECRET_KEY ? "Configured" : "Disabled"}
          </li>
        </ul>
      </section>
    </div>
  );
}
