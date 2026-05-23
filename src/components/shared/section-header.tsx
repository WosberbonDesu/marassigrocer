interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  variant?: "light" | "dark";
  eyebrow?: string;
}

export function SectionHeader({
  title,
  subtitle,
  className = "",
  align = "center",
  variant = "light",
  eyebrow,
}: SectionHeaderProps) {
  const isDark = variant === "dark";
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {eyebrow && (
        <p
          className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] ${
            isDark ? "text-[oklch(0.78_0.12_80)]" : "text-[oklch(0.60_0.12_75)]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-3 text-lg ${
            isDark ? "text-white/65" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
      {align === "center" && (
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <div
            className={`h-px w-12 bg-gradient-to-r from-transparent ${
              isDark ? "to-[oklch(0.78_0.12_80)]/70" : "to-[oklch(0.72_0.11_80)]/70"
            }`}
          />
          <div
            className={`h-1.5 w-1.5 rotate-45 ${
              isDark ? "bg-[oklch(0.78_0.12_80)]" : "bg-[oklch(0.72_0.11_80)]"
            }`}
          />
          <div
            className={`h-px w-12 bg-gradient-to-l from-transparent ${
              isDark ? "to-[oklch(0.78_0.12_80)]/70" : "to-[oklch(0.72_0.11_80)]/70"
            }`}
          />
        </div>
      )}
    </div>
  );
}
