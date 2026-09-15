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
    <header className="sticky top-0 z-40 bg-[color:var(--color-ivory)]/95 backdrop-blur">
      <div className="mx-auto flex items-center justify-between px-6 py-6 md:px-12">
        <Wordmark />
        <div className="flex items-center gap-10">
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("nav-link", !active && "opacity-60 hover:opacity-100")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="flex flex-col gap-[3px]"
          >
            <span className="block h-px w-5 bg-[color:var(--color-charcoal)]" />
            <span className="block h-px w-5 bg-[color:var(--color-charcoal)]" />
            <span className="block h-px w-5 bg-[color:var(--color-charcoal)]" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t rule-soft">
          <div className="mx-auto flex flex-col gap-4 px-6 py-6 md:px-12">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="nav-link"
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
