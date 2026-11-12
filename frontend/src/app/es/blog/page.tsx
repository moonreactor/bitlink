import { blogIndexMetadata, BlogIndexView } from "@/components/blog/views";

export const metadata = blogIndexMetadata("es");

export default function Page() {
  return <BlogIndexView lang="es" />;
}
