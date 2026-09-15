import { InviteForm } from "./InviteForm";

export default function NewUser() {
  return (
    <div>
      <p className="kicker kicker-muted">Invite.</p>
      <h1 className="mt-4 mb-10 font-serif-display" style={{ fontSize: "2.5rem" }}>
        New user.
      </h1>
      <p className="mb-8 max-w-xl text-sm text-[color:var(--color-charcoal)]/80">
        Create an account for a teammate. Set an initial password and share it
        securely — they can rotate it after signing in. Admins must enroll 2FA
        before they can sign in.
      </p>
      <InviteForm />
    </div>
  );
}
