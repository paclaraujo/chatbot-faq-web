import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ChartTooltip } from "@/components/dashboard/chart-tooltip";
import { Panel } from "@/components/dashboard/panel";

export function QueriesTimelineChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <Panel title="Evolução das consultas" description="Volume diário de interações no período">
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
          <defs>
            <linearGradient id="grad-total" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="count"
            name="Consultas"
            stroke="var(--chart-1)"
            fill="url(#grad-total)"
            animationDuration={700}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}
