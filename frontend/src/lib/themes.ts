import type { SocialIconStyle, Theme } from "./types";

export const THEME_PRESETS: Record<string, Theme> = {
  midnight: {
    preset: "midnight",
    background_color: "#0f172a",
    background_image: null,
    button_color: "#ffffff",
    button_text_color: "#0f172a",
    button_style: "rounded",
    font_family: "DM Sans",
    text_color: "#f8fafc",
    social_icon_style: "mono",
    social_icon_color: "#f8fafc",
  },
  ocean: {
    preset: "ocean",
    background_color: "#0c4a6e",
    background_image: null,
    button_color: "#e0f2fe",
    button_text_color: "#0c4a6e",
    button_style: "pill",
    font_family: "DM Sans",
    text_color: "#f0f9ff",
    social_icon_style: "mono",
    social_icon_color: "#f0f9ff",
  },
  forest: {
    preset: "forest",
    background_color: "#14532d",
    background_image: null,
    button_color: "#dcfce7",
    button_text_color: "#14532d",
    button_style: "rounded",
    font_family: "DM Sans",
    text_color: "#f0fdf4",
    social_icon_style: "mono",
    social_icon_color: "#f0fdf4",
  },
  sunset: {
    preset: "sunset",
    background_color: "#7c2d12",
    background_image: null,
    button_color: "#ffedd5",
    button_text_color: "#7c2d12",
    button_style: "square",
    font_family: "Syne",
    text_color: "#fff7ed",
    social_icon_style: "mono",
    social_icon_color: "#fff7ed",
  },
  mono: {
    preset: "mono",
    background_color: "#fafafa",
    background_image: null,
    button_color: "#171717",
    button_text_color: "#fafafa",
    button_style: "rounded",
    font_family: "DM Sans",
    text_color: "#171717",
    social_icon_style: "brand",
    social_icon_color: "#171717",
  },
};

/** Resolve fill color for a social logo given theme settings. */
export function resolveSocialIconColor(
  theme: Pick<Theme, "social_icon_style" | "social_icon_color" | "text_color">,
  brandHex: string,
): string {
  const style: SocialIconStyle = theme.social_icon_style === "brand" ? "brand" : "mono";
  if (style === "brand") return brandHex;
  return theme.social_icon_color || theme.text_color || "#ffffff";
}

export function buttonRadius(style: string): string {
  if (style === "pill") return "9999px";
  if (style === "square") return "4px";
  return "14px";
}
