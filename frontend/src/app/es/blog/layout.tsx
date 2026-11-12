import { BlogShell } from "@/components/blog/BlogShell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BlogShell lang="es">{children}</BlogShell>;
}
