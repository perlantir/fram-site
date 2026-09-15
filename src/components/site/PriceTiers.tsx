"use client";

import { useState } from "react";
import { formatUSD } from "@/lib/utils";

export function PriceTiers({
  tiers,
}: {
  tiers: { id: number; label: string; priceCents: number }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid grid-cols-3 gap-3">
      {tiers.map((t, i) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setActive(i)}
          className={`flex flex-col items-start px-4 py-3 text-left transition-colors ${
            i === active
              ? "bg-[color:var(--color-charcoal)] text-[color:var(--color-ivory)]"
              : "border rule bg-transparent text-[color:var(--color-charcoal)] hover:border-[color:var(--color-charcoal)]"
          }`}
        >
          <span className="text-[10px] uppercase tracking-[0.22em]">{t.label}</span>
          <span className="mt-2 text-[13px] tracking-tight opacity-90">
            {formatUSD(t.priceCents)}
          </span>
        </button>
      ))}
    </div>
  );
}
