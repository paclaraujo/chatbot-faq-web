import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartTooltip } from '@/components/Dashboard/ChartTooltip'
import { Panel } from '@/components/Dashboard/Panel'

export function TopQuestionsChart({
  data,
}: {
  data: { name: string; count: number }[]
}) {
  return (
    <Panel
      title="Perguntas mais frequentes"
      description="Top consultas resolvidas pela base"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 16 }}
          barSize={18}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={190}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value: string) =>
              value.length > 34 ? `${value.slice(0, 34)}…` : value
            }
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: 'var(--secondary)' }}
          />
          <Bar
            dataKey="count"
            fill="var(--chart-1)"
            radius={[0, 6, 6, 0]}
            animationDuration={700}
          />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  )
}
