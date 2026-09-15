"use client";

import { useActionState, useState } from "react";
import { upsertProduct } from "./actions";

type Product = {
  id?: number;
  slug?: string;
  name?: string;
  tagline?: string;
  subtitle?: string;
  wood?: string;
  paneling?: string | null;
  benches?: string | null;
  heater?: string | null;
  door?: string | null;
  light?: string | null;
  capacity?: string | null;
  description?: string;
  heroImage?: string | null;
  planSvg?: string | null;
  elevationSvg?: string | null;
  order?: number;
  published?: boolean;
  detailsJson?: Record<string, string> | null;
};

export function ProductForm({ initial }: { initial?: Product }) {
  const details = (initial?.detailsJson ?? {}) as Record<string, string>;
  const [state, action, pending] = useActionState(upsertProduct, {
    ok: false,
  } as { ok: boolean; error?: string });
  const [published, setPublished] = useState(initial?.published ?? true);

  return (
    <form action={action} className="grid gap-8 md:grid-cols-2">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="md:col-span-2 grid gap-6 md:grid-cols-3">
        <div>
          <label>Slug</label>
          <input
            name="slug"
            required
            defaultValue={initial?.slug ?? ""}
            pattern="[a-z0-9-]+"
          />
        </div>
        <div>
          <label>Name</label>
          <input name="name" required defaultValue={initial?.name ?? ""} />
        </div>
        <div>
          <label>Order</label>
          <input
            name="order"
            type="number"
            defaultValue={initial?.order ?? 0}
          />
        </div>
      </div>

      <div>
        <label>Tagline (e.g. Cedar)</label>
        <input name="tagline" required defaultValue={initial?.tagline ?? ""} />
      </div>
      <div>
        <label>Subtitle</label>
        <input name="subtitle" required defaultValue={initial?.subtitle ?? ""} />
      </div>

      <div>
        <label>Wood</label>
        <input name="wood" required defaultValue={initial?.wood ?? ""} />
      </div>
      <div>
        <label>Paneling</label>
        <input name="paneling" defaultValue={initial?.paneling ?? ""} />
      </div>
      <div>
        <label>Benches</label>
        <input name="benches" defaultValue={initial?.benches ?? ""} />
      </div>
      <div>
        <label>Heater</label>
        <input name="heater" defaultValue={initial?.heater ?? ""} />
      </div>
      <div>
        <label>Door</label>
        <input name="door" defaultValue={initial?.door ?? ""} />
      </div>
      <div>
        <label>Light</label>
        <input name="light" defaultValue={initial?.light ?? ""} />
      </div>
      <div>
        <label>Capacity</label>
        <input name="capacity" defaultValue={initial?.capacity ?? ""} />
      </div>

      <div className="md:col-span-2">
        <label>Description</label>
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={initial?.description ?? ""}
          className="min-h-24"
        />
      </div>

      <div>
        <label>Hero image URL</label>
        <input name="heroImage" defaultValue={initial?.heroImage ?? ""} />
      </div>
      <div>
        <label>Plan SVG URL</label>
        <input name="planSvg" defaultValue={initial?.planSvg ?? ""} />
      </div>
      <div>
        <label>Elevation SVG URL</label>
        <input name="elevationSvg" defaultValue={initial?.elevationSvg ?? ""} />
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mr-2"
          />
          Published
        </label>
      </div>

      <div className="md:col-span-2 mt-6">
        <p className="kicker kicker-muted mb-4">Details</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label>Materials</label>
            <textarea name="materials" rows={3} defaultValue={details.MATERIALS ?? ""} />
          </div>
          <div>
            <label>Construction</label>
            <textarea name="construction" rows={3} defaultValue={details.CONSTRUCTION ?? ""} />
          </div>
          <div>
            <label>Heater (detail)</label>
            <textarea name="heaterDetail" rows={3} defaultValue={details.HEATER ?? ""} />
          </div>
          <div>
            <label>Lighting</label>
            <textarea name="lighting" rows={3} defaultValue={details.LIGHTING ?? ""} />
          </div>
          <div>
            <label>Dimensions</label>
            <textarea name="dimensions" rows={3} defaultValue={details.DIMENSIONS ?? ""} />
          </div>
          <div>
            <label>Included features</label>
            <textarea
              name="features"
              rows={3}
              defaultValue={details["INCLUDED FEATURES"] ?? ""}
            />
          </div>
        </div>
      </div>

      {state.error && (
        <p className="md:col-span-2 text-sm text-red-600">{state.error}</p>
      )}

      <div className="md:col-span-2 pt-4">
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}
