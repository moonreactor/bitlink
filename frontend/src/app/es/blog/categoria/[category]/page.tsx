import { categoryMetadata, categoryParams, CategoryView } from "@/components/blog/views";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryParams("es");
}

export async function generateMetadata({ params }: Props) {
  return categoryMetadata("es", (await params).category);
}

export default async function Page({ params }: Props) {
  return <CategoryView lang="es" slug={(await params).category} />;
}
