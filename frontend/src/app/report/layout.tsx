import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Report a link | Bitlink",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
