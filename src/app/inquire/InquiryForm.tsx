"use client";

import { useActionState } from "react";
import { submitInquiry, type InquiryState } from "./actions";

const initial: InquiryState = { ok: false };

export function InquiryForm({
  products,
  defaultProduct,
}: {
  products: { slug: string; name: string }[];
  defaultProduct?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="mt-12 grid gap-8 md:grid-cols-2">
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" required minLength={2} maxLength={120} />
        {err.name && <p className="mt-1 text-xs text-red-600">{err.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" required maxLength={254} />
        {err.email && <p className="mt-1 text-xs text-red-600">{err.email}</p>}
      </div>
      <div>
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" maxLength={40} />
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          placeholder="City, State"
          maxLength={120}
        />
      </div>
      <div>
        <label htmlFor="product">Model of interest</label>
        <select id="product" name="product" defaultValue={defaultProduct ?? ""}>
          <option value="">Undecided</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="timeline">Timeline</label>
        <select id="timeline" name="timeline" defaultValue="">
          <option value="">Select a timeline</option>
          <option value="0-3">0–3 months</option>
          <option value="3-6">3–6 months</option>
          <option value="6-12">6–12 months</option>
          <option value="12+">12+ months</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={4000}
          className="mt-0 min-h-32 resize-y"
        />
        {err.message && <p className="mt-1 text-xs text-red-600">{err.message}</p>}
      </div>

      {/* Honeypot — hidden from users */}
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error && (
        <p className="md:col-span-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="md:col-span-2 mt-4 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--color-muted)]">
          By submitting you agree to be contacted about your inquiry.
        </p>
        <button className="btn-primary" disabled={pending}>
          {pending ? "Sending…" : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}
