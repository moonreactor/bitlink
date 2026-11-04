/** Fonts available on public profiles / appearance picker. */
export const PROFILE_FONTS = [
  { id: "DM Sans", stack: '"DM Sans", system-ui, sans-serif', google: "DM+Sans:wght@400;500;600;700" },
  { id: "Syne", stack: '"Syne", system-ui, sans-serif', google: "Syne:wght@500;600;700;800" },
  {
    id: "Outfit",
    stack: '"Outfit", system-ui, sans-serif',
    google: "Outfit:wght@400;500;600;700",
  },
  {
    id: "Space Grotesk",
    stack: '"Space Grotesk", system-ui, sans-serif',
    google: "Space+Grotesk:wght@400;500;600;700",
  },
  {
    id: "Fraunces",
    stack: '"Fraunces", Georgia, serif',
    google: "Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700",
  },
  {
    id: "IBM Plex Sans",
    stack: '"IBM Plex Sans", system-ui, sans-serif',
    google: "IBM+Plex+Sans:wght@400;500;600;700",
  },
] as const;

export type ProfileFontId = (typeof PROFILE_FONTS)[number]["id"];

export function fontStack(fontFamily: string | null | undefined): string {
  const match = PROFILE_FONTS.find((f) => f.id === fontFamily);
  return match?.stack || PROFILE_FONTS[0].stack;
}

export function googleFontsHref(fontFamily: string | null | undefined): string | null {
  const match = PROFILE_FONTS.find((f) => f.id === fontFamily);
  if (!match) return null;
  // DM Sans + Syne already loaded globally via next/font
  if (match.id === "DM Sans" || match.id === "Syne") return null;
  return `https://fonts.googleapis.com/css2?family=${match.google}&display=swap`;
}
