"use client";

import { useActionState } from "react";
import { upsertEvidence } from "./actions";

type Citation = {
  id?: number;
  category?: "longevity" | "mind" | "heat" | "cold";
  kicker?: string;
  title?: string;
  authors?: string | null;
  journal?: string;
  year?: number;
  url?: string | null;
  order?: number;
  published?: boolean;
};

export function EvidenceForm({ initial }: { initial?: Citation }) {
  const [state, action, pending] = useActionState(upsertEvidence, {
    ok: false,
  } as { ok: boolean; error?: string });

  return (
    <form action={action} className="grid gap-6 md:grid-cols-2">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div>
        <label>Category</label>
        <select name="category" defaultValue={initial?.category ?? "longevity"} required>
          <option value="longevity">Longevity</option>
          <option value="mind">Mind</option>
          <option value="heat">Heat</option>
          <option value="cold">Cold</option>
        </select>
      </div>
      <div>
        <label>Year</label>
        <input
          name="year"
          type="number"
          defaultValue={initial?.year ?? new Date().getFullYear()}
          required
        />
      </div>
      <div className="md:col-span-2">
        <label>Kicker (e.g. "Sauna Bathing & Longevity — JAMA Internal Medicine")</label>
        <input name="kicker" defaultValue={initial?.kicker ?? ""} required />
      </div>
      <div className="md:col-span-2">
        <label>Title</label>
        <input name="title" defaultValue={initial?.title ?? ""} required />
      </div>
      <div>
        <label>Authors</label>
        <input name="authors" defaultValue={initial?.authors ?? ""} />
      </div>
      <div>
        <label>Journal</label>
        <input name="journal" defaultValue={initial?.journal ?? ""} required />
      </div>
      <div className="md:col-span-2">
        <label>URL</label>
        <input name="url" type="url" defaultValue={initial?.url ?? ""} />
      </div>
      <div>
        <label>Order</label>
        <input name="order" type="number" defaultValue={initial?.order ?? 0} />
      </div>
      <div className="flex items-end">
        <label>
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? true}
            className="mr-2"
          />
          Published
        </label>
      </div>
      {state.error && <p className="md:col-span-2 text-sm text-red-600">{state.error}</p>}
      <div className="md:col-span-2 pt-4">
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save citation"}
        </button>
      </div>
    </form>
  );
}
