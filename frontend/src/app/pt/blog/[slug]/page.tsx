import { articleMetadata, articleParams, ArticleView } from "@/components/blog/views";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articleParams("pt");
}

export async function generateMetadata({ params }: Props) {
  return articleMetadata("pt", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <ArticleView lang="pt" slug={(await params).slug} />;
}
