type Category = "longevity" | "mind" | "heat" | "cold";

export function EvidenceIcon({ category }: { category: Category }) {
  const common = {
    width: 32,
    height: 32,
    viewBox: "0 0 32 32",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.2,
    "aria-hidden": true,
  };
  switch (category) {
    case "longevity":
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" />
          <path d="M16 8v8l5 3" />
        </svg>
      );
    case "mind":
      return (
        <svg {...common}>
          <path d="M6 18a10 10 0 1 1 20 0" />
          <path d="M11 18v4M21 18v4" />
        </svg>
      );
    case "heat":
      return (
        <svg {...common}>
          <path d="M12 4c2 4-2 5 0 9s6 3 6 7a6 6 0 1 1-12 0c0-4 4-3 4-8s-1-5 2-8z" />
        </svg>
      );
    case "cold":
      return (
        <svg {...common}>
          <path d="M16 4v24M6 10l20 12M6 22l20-12" />
        </svg>
      );
  }
}
