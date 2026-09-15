"use client";

import { useActionState } from "react";
import { bootstrapAdmin } from "./actions";

export function BootstrapForm() {
  const [state, action, pending] = useActionState(bootstrapAdmin, {
    ok: false,
  } as { ok: boolean; error?: string });
  return (
    <form action={action} className="mt-10 space-y-6">
      <div>
        <label>Bootstrap token</label>
        <input name="token" type="password" required />
      </div>
      <div>
        <label>Email</label>
        <input name="email" type="email" required />
      </div>
      <div>
        <label>Name</label>
        <input name="name" />
      </div>
      <div>
        <label>Password (min 12 chars)</label>
        <input
          name="password"
          type="password"
          required
          minLength={12}
          autoComplete="new-password"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button className="btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create admin"}
      </button>
    </form>
  );
}
