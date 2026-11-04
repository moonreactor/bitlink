import Image from "next/image";
import Link from "next/link";

type Props = {
  href?: string | null;
  /** Use white wordmark for dark backgrounds */
  onDark?: boolean;
  /** Icon-only “b” mark */
  mark?: boolean;
  className?: string;
  /** Visual height of the logo in px */
  height?: number;
  priority?: boolean;
};

export function BitlinkLogo({
  href = "/",
  onDark = false,
  mark = false,
  className = "",
  height = 28,
  priority = false,
}: Props) {
  const src = mark ? "/bitlink-mark.png" : onDark ? "/bitlink-logo-light.png" : "/bitlink-logo.png";
  // Full wordmark ~3.4:1; mark is square
  const width = mark ? height : Math.round(height * (1824 / 540));

  const img = (
    <Image
      src={src}
      alt="Bitlink"
      width={width}
      height={height}
      priority={priority}
      className="h-auto w-auto"
      style={{ height, width: "auto" }}
    />
  );

  if (href === null) {
    return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  }

  return (
    <Link href={href} className={`inline-flex items-center ${className}`} aria-label="Bitlink home">
      {img}
    </Link>
  );
}
