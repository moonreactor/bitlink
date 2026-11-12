import { renderArticleOg, OG_SIZE } from "@/components/blog/ogImage";
import { articleParams } from "@/components/blog/views";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Bitlink";

export function generateStaticParams() {
  return articleParams("pt");
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  return renderArticleOg("pt", (await params).slug);
}
