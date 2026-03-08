interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepsTimelineProps {
  steps: Step[];
  variant?: "horizontal" | "vertical";
}

export function StepsTimeline({ steps, variant = "horizontal" }: StepsTimelineProps) {
  if (variant === "vertical") {
    return (
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={step.number} className="relative flex gap-6 pb-8 last:pb-0">
            {/* Line */}
            {i < steps.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-px bg-border" />
            )}
            {/* Number */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {step.number}
            </div>
            {/* Content */}
            <div className="pt-1">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
            {step.number}
          </div>
          <h3 className="text-sm font-semibold">{step.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  );
}
