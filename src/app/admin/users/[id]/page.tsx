import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { disable2fa, resetPassword, updateUser } from "../actions";
import { Enroll2fa } from "./Enroll2fa";

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = await db.query.users.findFirst({ where: eq(users.id, id) });
  if (!u) notFound();

  return (
    <div>
      <p className="kicker kicker-muted">User.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2rem" }}>
        {u.email}
      </h1>

      <div className="grid gap-10 md:grid-cols-2">
        <section className="border rule p-6">
          <p className="kicker kicker-muted">Profile</p>
          <form action={updateUser} className="mt-6 space-y-4">
            <input type="hidden" name="id" value={u.id} />
            <div>
              <label>Role</label>
              <select name="role" defaultValue={u.role}>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="viewer">viewer</option>
              </select>
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="disabled"
                  defaultChecked={!!u.disabledAt}
                  className="mr-2"
                />
                Disable account
              </label>
            </div>
            <button className="btn-primary" type="submit">
              Save
            </button>
          </form>
        </section>

        <section className="border rule p-6">
          <p className="kicker kicker-muted">Reset password</p>
          <form action={resetPassword} className="mt-6 space-y-4">
            <input type="hidden" name="id" value={u.id} />
            <div>
              <label>New password (min 12 chars)</label>
              <input
                type="text"
                name="password"
                required
                minLength={12}
                autoComplete="new-password"
              />
            </div>
            <button className="btn-primary" type="submit">
              Reset password
            </button>
          </form>
        </section>

        <section className="border rule p-6 md:col-span-2">
          <p className="kicker kicker-muted">Two-factor authentication</p>
          <p className="mt-4 text-sm text-[color:var(--color-charcoal)]/80">
            {u.totpEnabled
              ? "TOTP is enabled. Scan a new code to rotate, or disable below."
              : "TOTP is not enabled. Admin accounts must enroll before they can sign in."}
          </p>
          <div className="mt-6">
            <Enroll2fa userId={u.id} enabled={u.totpEnabled} />
          </div>
          {u.totpEnabled && (
            <form action={disable2fa} className="mt-6">
              <input type="hidden" name="id" value={u.id} />
              <button
                type="submit"
                className="text-[11px] uppercase tracking-[0.18em] text-red-700 underline"
              >
                Disable 2FA
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
