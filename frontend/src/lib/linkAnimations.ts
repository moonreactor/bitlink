export type LinkAnimationId =
  | "none"
  | "float"
  | "pulse"
  | "wiggle"
  | "bounce"
  | "glow"
  | "jelly"
  | "rainbow"
  | "sparkle";

export type LinkAnimationPreset = {
  id: LinkAnimationId;
  label: string;
  vibe: "simple" | "fun" | "wild";
  description: string;
};

export const LINK_ANIMATIONS: LinkAnimationPreset[] = [
  { id: "none", label: "None", vibe: "simple", description: "No motion" },
  { id: "float", label: "Float", vibe: "simple", description: "Soft up & down" },
  { id: "pulse", label: "Pulse", vibe: "simple", description: "Gentle scale" },
  { id: "glow", label: "Glow", vibe: "simple", description: "Soft light pulse" },
  { id: "wiggle", label: "Wiggle", vibe: "fun", description: "Playful shake" },
  { id: "bounce", label: "Bounce", vibe: "fun", description: "Bouncy hop" },
  { id: "jelly", label: "Jelly", vibe: "wild", description: "Squishy wobble" },
  { id: "rainbow", label: "Rainbow", vibe: "wild", description: "Color border spin" },
  { id: "sparkle", label: "Sparkle", vibe: "wild", description: "Shimmer + pop" },
];

export function animationClass(animation?: string | null): string {
  const id = (animation || "none").toLowerCase();
  if (id === "none") return "";
  return `link-anim link-anim--${id}`;
}
