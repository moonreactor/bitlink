import { articleMetadata, articleParams, ArticleView } from "@/components/blog/views";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams("es");
}

export async function generateMetadata({ params }: Props) {
  return articleMetadata("es", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ArticleView lang="es" slug={(await params).slug} />;
}
