import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231d9e75' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-extrabold tracking-tight text-ink">Bitlink</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-ink/70 hover:text-ink">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative mx-auto flex max-w-5xl flex-col items-start gap-8 px-6 pb-24 pt-16 md:pt-24">
        <p className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-7xl">
          Bitlink
        </p>
        <h1 className="max-w-2xl text-2xl font-medium leading-snug text-ink/80 md:text-3xl">
          One page for every link you share. Free forever — no plans, no limits on the core.
        </h1>
        <p className="max-w-xl text-base text-ink/60">
          Build your bio page, track clicks, schedule drops, lock links, and remove branding.
          Everything included.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accentSoft"
          >
            Create your Bitlink
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-ink/15 bg-white/60 px-6 py-3 text-sm font-semibold text-ink backdrop-blur transition hover:bg-white"
          >
            I already have one
          </Link>
        </div>
      </section>
    </main>
  );
}
