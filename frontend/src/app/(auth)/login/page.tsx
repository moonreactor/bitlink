import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6">
          <p className="text-sm text-ink/60">Loading…</p>
        </div>
      }
    >
      <AuthForm mode="login" />
    </Suspense>
  );
}
