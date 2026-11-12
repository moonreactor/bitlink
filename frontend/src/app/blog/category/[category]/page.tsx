import { categoryMetadata, categoryParams, CategoryView } from "@/components/blog/views";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryParams("en");
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("en", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryView lang="en" slug={(await params).category} />;
}
