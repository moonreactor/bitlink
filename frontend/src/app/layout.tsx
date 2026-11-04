import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { absoluteAsset, OG_IMAGE_PATH, siteUrl } from "@/lib/site";
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

const WEB = siteUrl();
const OG_IMAGE = absoluteAsset(OG_IMAGE_PATH);

export const metadata: Metadata = {
  metadataBase: new URL(WEB),
  title: "Bitlink — Link-in-bio + short links, free forever",
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
