import { categoryMetadata, categoryParams, CategoryView } from "@/components/blog/views";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryParams("pt");
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("pt", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryView lang="pt" slug={(await params).category} />;
}
