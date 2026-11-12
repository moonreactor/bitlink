import { blogIndexMetadata, BlogIndexView } from "@/components/blog/views";

export const metadata = blogIndexMetadata("en");

export default function Page() {
  return <BlogIndexView lang="en" />;
}
