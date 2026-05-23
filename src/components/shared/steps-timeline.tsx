interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepsTimelineProps {
  steps: Step[];
  variant?: "horizontal" | "vertical";
  dark?: boolean;
}

export function StepsTimeline({ steps, variant = "horizontal", dark = false }: StepsTimelineProps) {
  if (variant === "vertical") {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex gap-6 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <div className={`absolute left-5 top-12 h-full w-px ${dark ? "bg-white/15" : "bg-border"}`} />
            )}
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                dark
                  ? "bg-[oklch(0.78_0.12_80)] text-[oklch(0.18_0.02_80)]"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {step.number}
            </div>
            <div className="pt-1">
              <h3 className={`text-lg font-semibold ${dark ? "text-white" : ""}`}>{step.title}</h3>
              <p className={`mt-1 text-sm leading-relaxed ${dark ? "text-white/60" : "text-muted-foreground"}`}>
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {steps.map((step) => (
        <div key={step.number} className="relative text-center">
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ring-1 ring-inset ${
              dark
                ? "bg-[oklch(0.78_0.12_80)]/15 text-[oklch(0.82_0.11_80)] ring-[oklch(0.78_0.12_80)]/25"
                : "bg-primary text-primary-foreground ring-transparent"
            }`}
          >
            {step.number}
          </div>
          <h3 className={`text-sm font-semibold ${dark ? "text-white" : ""}`}>{step.title}</h3>
          <p className={`mt-1.5 text-xs leading-relaxed ${dark ? "text-white/60" : "text-muted-foreground"}`}>
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
