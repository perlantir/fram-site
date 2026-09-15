"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function LoginForm({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(error ? "Invalid credentials." : null);

  return (
    <form
      className="mt-12 space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setMsg(null);
        const f = e.currentTarget;
        const data = new FormData(f);
        const res = await signIn("credentials", {
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
          totp: String(data.get("totp") ?? ""),
          redirect: false,
        });
        setPending(false);
        if (res?.error) {
          setMsg("Invalid credentials or 2FA code.");
          return;
        }
        window.location.href = "/admin";
      }}
    >
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
        />
      </div>
      <div>
        <label htmlFor="totp">2FA Code (if enabled)</label>
        <input
          id="totp"
          name="totp"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
        />
      </div>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
      <button className="btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
