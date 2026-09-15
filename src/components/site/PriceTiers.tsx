"use client";

import { useState } from "react";
import { formatUSD } from "@/lib/utils";

export function PriceTiers({
  tiers,
}: {
  tiers: { id: number; label: string; priceCents: number }[];
}) {
  const [active, setActive] = useState(0);
  const current = tiers[active];
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {tiers.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(i)}
            className={`flex flex-col items-start border px-3 py-3 text-left transition-colors ${
              i === active
                ? "border-[color:var(--color-charcoal)] bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]"
                : "rule bg-transparent text-[color:var(--color-charcoal)] hover:border-[color:var(--color-charcoal)]"
            }`}
          >
            <span className="text-[10px] uppercase tracking-[0.18em]">{t.label}</span>
            <span className="mt-1 text-xs opacity-80">{formatUSD(t.priceCents)}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs text-[color:var(--color-muted)]">
        {current ? formatUSD(current.priceCents) : ""} shown. Delivery & install quoted separately.
      </p>
    </div>
  );
}
