import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const rows = await db.select().from(users).orderBy(asc(users.email));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="kicker kicker-muted">Team.</p>
          <h1 className="mt-4 font-serif-display" style={{ fontSize: "2.5rem" }}>
            Users.
          </h1>
        </div>
        <Link href="/admin/users/new" className="btn-primary">
          Invite user
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule-soft text-left text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
            <th className="py-3">Email</th>
            <th className="py-3">Name</th>
            <th className="py-3">Role</th>
            <th className="py-3">2FA</th>
            <th className="py-3">Status</th>
            <th className="py-3">Last login</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b rule-soft align-middle">
              <td className="py-3">{u.email}</td>
              <td className="py-3">{u.name ?? "—"}</td>
              <td className="py-3 uppercase text-[11px] tracking-[0.14em]">{u.role}</td>
              <td className="py-3">
                {u.totpEnabled ? (
                  <span className="text-emerald-700 text-[11px] uppercase tracking-[0.14em]">
                    Enabled
                  </span>
                ) : (
                  <span className="text-[color:var(--color-muted)] text-[11px] uppercase tracking-[0.14em]">
                    Off
                  </span>
                )}
              </td>
              <td className="py-3">
                {u.disabledAt ? (
                  <span className="text-red-700 text-[11px] uppercase tracking-[0.14em]">
                    Disabled
                  </span>
                ) : (
                  <span className="text-emerald-700 text-[11px] uppercase tracking-[0.14em]">
                    Active
                  </span>
                )}
              </td>
              <td className="py-3 text-xs text-[color:var(--color-muted)]">
                {u.lastLoginAt ? u.lastLoginAt.toISOString().slice(0, 16).replace("T", " ") : "—"}
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/users/${u.id}`}
                  className="text-[11px] uppercase tracking-[0.16em] underline"
                >
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
