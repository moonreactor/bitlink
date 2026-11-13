import type { Metadata } from "next";
import localFont from "next/font/local";
import { absoluteAsset, OG_IMAGE_PATH, siteUrl } from "@/lib/site";
import "./globals.css";

// Self-hosted (latin variable woff2 from Google Fonts) instead of next/font/google:
// the Google loader fetches at build time and intermittently crashes the Docker
// build ("Cannot read properties of null (reading '1')") when Google returns a
// font URL without a file extension.
const syne = localFont({
  src: "../fonts/syne-latin.woff2",
  variable: "--font-syne",
  weight: "400 800",
  display: "swap",
});

const dmSans = localFont({
  src: "../fonts/dm-sans-latin.woff2",
  variable: "--font-dm-sans",
  weight: "100 1000",
  display: "swap",
});

const WEB = siteUrl();
const OG_IMAGE = absoluteAsset(OG_IMAGE_PATH);

export const metadata: Metadata = {
  metadataBase: new URL(WEB),
  title: "Bitlink — Link-in-bio + short links, free forever",
  applicationName: "Bitlink",
  alternates: {
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: "Blog de Bitlink" }] },
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  description:
    "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
  openGraph: {
    title: "Bitlink — Link-in-bio + short links, free forever",
    description:
      "Unlimited link-in-bio and short links with analytics, QR, UTMs, embeds, and themes — free forever. No monthly caps.",
    url: WEB,
    siteName: "Bitlink",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1731,
        height: 908,
        alt: "Bitlink",
        type: "image/webp",
      },
    ],
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
