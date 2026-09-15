import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth, signOut } from "@/lib/auth";
import { Wordmark } from "@/components/site/Wordmark";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";

export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard", roles: ["admin", "editor", "viewer"] },
  { href: "/admin/products", label: "Products", roles: ["admin", "editor", "viewer"] },
  { href: "/admin/inquiries", label: "Inquiries", roles: ["admin", "editor", "viewer"] },
  { href: "/admin/evidence", label: "Evidence", roles: ["admin", "editor", "viewer"] },
  { href: "/admin/users", label: "Users", roles: ["admin"] },
  { href: "/admin/audit", label: "Audit Log", roles: ["admin"] },
  { href: "/admin/settings", label: "Settings", roles: ["admin", "editor"] },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user as
    | { id: string; email: string; role: "admin" | "editor" | "viewer" }
    | undefined;

  // Unauthenticated: render a bare wrapper so /admin/login and
  // /admin/bootstrap can be reached. Middleware guards the rest.
  if (!user) {
    return (
      <div className="min-h-screen bg-[color:var(--color-ivory)] text-[color:var(--color-charcoal)]">
        {children}
      </div>
    );
  }

  const items = NAV.filter((n) => n.roles.includes(user.role));

  const fresh = await db.query.users.findFirst({
    where: eq(usersTable.id, user.id),
    columns: { totpEnabled: true },
  });
  const needs2fa = user.role === "admin" && !fresh?.totpEnabled;

  return (
    <div className="min-h-screen bg-[color:var(--color-ivory)] text-[color:var(--color-charcoal)]">
      <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r rule-soft bg-[color:var(--color-ivory)] md:flex">
        <div className="px-6 pt-8">
          <Wordmark />
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-muted)]">
            Admin
          </p>
        </div>
        <nav className="mt-10 flex flex-col gap-1 px-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-3 py-2 text-[11px] uppercase tracking-[0.16em] hover:bg-[color:var(--color-ivory-soft)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-6 py-6 text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          <p className="mb-1">{user.email}</p>
          <p className="mb-4">Role: {user.role}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="underline">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="md:pl-60">
        {needs2fa && (
          <div className="border-b border-amber-500/40 bg-amber-500/10 px-6 py-3 text-sm md:px-10">
            <strong className="mr-2 text-[11px] uppercase tracking-[0.18em]">
              Enable 2FA now.
            </strong>
            You&apos;re signed in without two-factor auth.{" "}
            <Link
              href={`/admin/users/${user.id}`}
              className="underline"
            >
              Enroll a TOTP secret →
            </Link>
          </div>
        )}
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
