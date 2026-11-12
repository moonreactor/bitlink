"use client";

import Link from "next/link";

export type SetupStep = {
  id: string;
  title: string;
  hint: string;
  done: boolean;
  cta: string;
  href?: string;
  onClick?: () => void;
};

/**
 * Activation checklist (Zeigarnik effect + visible progress). The first
 * unfinished step is expanded with a primary CTA; the rest stay compact.
 */
export function SetupChecklist({
  steps,
  onDismiss,
}: {
  steps: SetupStep[];
  onDismiss?: () => void;
}) {
  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);
  const nextId = steps.find((s) => !s.done)?.id;

  return (
    <section className="mu-card overflow-hidden" aria-labelledby="setup-title">
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="setup-title" className="font-display text-lg font-bold text-ink">
              Set up your page
            </h2>
            <p className="mt-0.5 text-sm text-meetup-muted">
              {doneCount} of {steps.length} done — finish these and your page is ready to share.
            </p>
          </div>
          {onDismiss && doneCount >= 1 && (
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-meetup-muted hover:bg-mist"
            >
              Hide
            </button>
          )}
        </div>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-mist"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Setup progress"
        >
          <div
            className="h-full rounded-full bg-meetup-purple transition-[width] duration-500"
            style={{ width: `${Math.max(pct, 4)}%` }}
          />
        </div>
      </div>

      <ol className="border-t border-meetup-border">
        {steps.map((step, i) => {
          const isNext = step.id === nextId;
          return (
            <li
              key={step.id}
              className={`border-b border-meetup-border last:border-b-0 ${isNext ? "bg-meetup-lavender/50" : ""}`}
            >
              <div className="flex items-start gap-3 px-5 py-4 md:px-6">
                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    step.done
                      ? "bg-emerald-500 text-white"
                      : isNext
                        ? "bg-meetup-purple text-white"
                        : "border border-meetup-border bg-white text-meetup-muted"
                  }`}
                  aria-hidden
                >
                  {step.done ? "✓" : i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[15px] font-semibold ${
                      step.done ? "text-meetup-muted line-through decoration-meetup-border" : "text-ink"
                    }`}
                  >
                    {step.title}
                    <span className="sr-only">{step.done ? " (done)" : ""}</span>
                  </p>
                  {isNext && <p className="mt-0.5 text-sm text-meetup-muted">{step.hint}</p>}
                  {isNext && (
                    <div className="mt-3">
                      <StepCta step={step} primary />
                    </div>
                  )}
                </div>
                {!step.done && !isNext && <StepCta step={step} />}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StepCta({ step, primary }: { step: SetupStep; primary?: boolean }) {
  const cls = primary
    ? "mu-btn-primary min-h-[44px] w-full sm:w-auto"
    : "shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-meetup-purple hover:bg-meetup-lavender";
  if (step.href) {
    return (
      <Link href={step.href} className={cls}>
        {step.cta}
      </Link>
    );
  }
  return (
    <button type="button" onClick={step.onClick} className={cls}>
      {step.cta}
    </button>
  );
}
