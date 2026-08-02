export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-soft">
      {label !== undefined && (
        <p className="mb-1 font-medium text-popover-foreground">{label}</p>
      )}
      {payload.map((item, index) => (
        <p key={index} className="flex items-center gap-2 text-muted-foreground">
          <span className="size-2 rounded-full" style={{ background: item.color }} />
          {item.name}: <span className="font-medium text-popover-foreground">{item.value}</span>
        </p>
      ))}
    </div>
  );
}
