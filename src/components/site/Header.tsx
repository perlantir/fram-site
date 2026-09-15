"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "./Wordmark";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/saunas", label: "Saunas" },
  { href: "/evidence", label: "Evidence" },
  { href: "/inquire", label: "Inquire" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[color:var(--color-ivory)]/90 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-6 py-5 md:px-10">
        <Wordmark />
        <nav className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-[11px] uppercase tracking-[0.18em]",
                  active ? "text-charcoal" : "text-charcoal/70 hover:text-charcoal"
                )}
                style={{ color: "var(--color-charcoal)" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden"
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
            <line x1="0" y1="1" x2="20" y2="1" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="13" x2="20" y2="13" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-t rule-soft md:hidden">
          <div className="mx-auto flex flex-col gap-4 px-6 py-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-[0.18em]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
