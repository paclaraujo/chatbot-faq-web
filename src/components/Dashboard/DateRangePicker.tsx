const RANGES = [
  { label: "7 dias", days: 7 },
  { label: "14 dias", days: 14 },
  { label: "30 dias", days: 30 },
];

export function DateRangePicker({
  days,
  onChange,
}: {
  days: number;
  onChange: (days: number) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-border bg-card p-1">
      {RANGES.map((range) => (
        <button
          key={range.days}
          type="button"
          onClick={() => onChange(range.days)}
          className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
            days === range.days
              ? "bg-brand-gradient text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
