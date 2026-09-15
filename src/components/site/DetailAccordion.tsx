"use client";

import { useState } from "react";

export function DetailAccordion({
  details,
}: {
  details: Record<string, string>;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const rows = Object.entries(details);

  return (
    <ul className="divide-y rule-soft border-y rule-soft">
      {rows.map(([key, value]) => {
        const expanded = open === key;
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : key)}
              className="flex w-full items-center justify-between py-4 text-left text-[10px] uppercase tracking-[0.22em]"
              aria-expanded={expanded}
            >
              <span>{key}</span>
              <span aria-hidden="true" className="text-base leading-none">
                {expanded ? "−" : "+"}
              </span>
            </button>
            {expanded && (
              <p className="pb-6 pr-8 text-[13px] leading-[1.7] text-[color:var(--color-charcoal)]/80">
                {value}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
