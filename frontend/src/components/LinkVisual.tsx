import {
  SocialBrandIcon,
  brandColor,
  brandFromPlatform,
  detectSocialBrand,
} from "@/lib/socialBrands";

type Props = {
  icon?: string | null;
  thumbnailUrl?: string | null;
  url?: string | null;
  platform?: string | null;
  featured?: boolean;
  size?: "sm" | "md" | "lg";
  /**
   * well = tinted brand square (link rows)
   * plain = glyph only (social strip)
   */
  chrome?: "well" | "plain";
  /** Override fill; "brand" keeps official color */
  iconColor?: string | "brand";
};

const SIZE = {
  sm: "h-8 w-8 text-base",
  md: "h-10 w-10 text-xl",
  lg: "h-14 w-14 text-2xl",
};

const ICON_SIZE = {
  sm: "text-[15px]",
  md: "text-[18px]",
  lg: "text-[26px]",
};

export function LinkVisual({
  icon,
  thumbnailUrl,
  url,
  platform,
  featured,
  size = "md",
  chrome = "well",
  iconColor = "brand",
}: Props) {
  const box = SIZE[size];
  const brand = detectSocialBrand(url) || brandFromPlatform(platform);

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

  if (brand) {
    const brandHex = brandColor(brand.id);
    const color = !iconColor || iconColor === "brand" ? brandHex : iconColor;

    if (chrome === "plain") {
      return (
        <span
          className={`${box} inline-flex shrink-0 items-center justify-center ${ICON_SIZE[size]}`}
          style={{ color }}
          aria-hidden
          title={brand.label}
        >
          <SocialBrandIcon brandId={brand.id} />
        </span>
      );
    }

    return (
      <span
        className={`${box} inline-flex shrink-0 items-center justify-center rounded-xl ${ICON_SIZE[size]}`}
        style={{ background: `${brandHex}18`, color }}
        aria-hidden
        title={brand.label}
      >
        <SocialBrandIcon brandId={brand.id} />
      </span>
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

  return (
    <span
      className={`${box} inline-flex shrink-0 items-center justify-center rounded-xl bg-black/5 text-sm opacity-50`}
      aria-hidden
    >
      🔗
    </span>
  );
}
