import { blogIndexMetadata, BlogIndexView } from "@/components/blog/views";

export const metadata = blogIndexMetadata("pt");

export default function Page() {
  return <BlogIndexView lang="pt" />;
}
