type Props = {
  icon?: string | null;
  thumbnailUrl?: string | null;
  featured?: boolean;
  size?: "sm" | "md" | "lg";
};

const SIZE = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-14 w-14 text-2xl",
};

export function LinkVisual({ icon, thumbnailUrl, featured, size = "md" }: Props) {
  const box = SIZE[size];

  if (thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt=""
        className={`${box} shrink-0 rounded-xl object-cover ${featured ? "ring-2 ring-white/50" : ""}`}
      />
    );
  }

  if (icon) {
    return (
      <span
        className={`${box} inline-flex shrink-0 items-center justify-center rounded-xl bg-black/5`}
        aria-hidden
      >
        {icon}
      </span>
    );
  }

  return null;
}
