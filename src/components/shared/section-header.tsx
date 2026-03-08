interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  className = "",
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
