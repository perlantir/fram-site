"use client";

import { useActionState } from "react";
import { createUser } from "../actions";

export function InviteForm() {
  const [state, action, pending] = useActionState(createUser, {
    ok: false,
  } as { ok: boolean; error?: string });

  return (
    <form action={action} className="grid gap-6 md:max-w-2xl md:grid-cols-2">
      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>
      <div>
        <label>Name</label>
        <input name="name" />
      </div>
      <div>
        <label>Role</label>
        <select name="role" defaultValue="viewer">
          <option value="admin">admin</option>
          <option value="editor">editor</option>
          <option value="viewer">viewer</option>
        </select>
      </div>
      <div>
        <label>Initial password (min 12 chars)</label>
        <input
          type="text"
          name="password"
          required
          minLength={12}
          autoComplete="new-password"
        />
      </div>
      {state.error && <p className="md:col-span-2 text-sm text-red-600">{state.error}</p>}
      <div className="md:col-span-2 pt-4">
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create user"}
        </button>
      </div>
    </form>
  );
}
