import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
});

const WEB =
  process.env.NEXT_PUBLIC_WEB_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(":8000", ":3000") ||
  "http://localhost:3000";

const OG_IMAGE = `${WEB.replace(/\/$/, "")}/bitlink-og.webp`;

export const metadata: Metadata = {
  title: "Bitlink — Link-in-bio + short links, free forever",
  description:
    "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
  metadataBase: new URL(WEB),
  openGraph: {
    title: "Bitlink — Link-in-bio + short links, free forever",
    description:
      "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
    siteName: "Bitlink",
    type: "website",
    images: [{ url: "/bitlink-og.webp", alt: "Bitlink" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitlink — Link-in-bio + short links, free forever",
    description:
      "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${dmSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
