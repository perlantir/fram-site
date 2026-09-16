import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fram.example"),
  title: {
    default: "FRAM — A Nordic Experience.",
    template: "%s — FRAM",
  },
  description:
    "FRAM designs residential saunas rooted in Nordic tradition — refined, natural, elemental.",
  icons: {
    icon: [
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logos/fram-emblem.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "FRAM — A Nordic Experience.",
    description: "Residential saunas rooted in Nordic tradition.",
    url: "/",
    siteName: "FRAM",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
