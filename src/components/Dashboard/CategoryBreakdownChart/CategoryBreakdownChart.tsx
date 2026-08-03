import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartTooltip } from '@/components/Dashboard/ChartTooltip'
import { Panel } from '@/components/Dashboard/Panel'
import { Skeleton } from '@/components/Skeleton'

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted-foreground)',
]

export function CategoryBreakdownChart({
  data,
  loading,
}: {
  data: { name: string; value: number }[]
  loading?: boolean
}) {
  if (loading) {
    return (
      <Panel
        title="Distribuição por categoria"
        description="Participação de cada área da base de conhecimento"
      >
        <div className="flex h-75 items-center justify-center">
          <Skeleton className="size-50 rounded-full" />
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      </Panel>
    )
  }

  return (
    <Panel
      title="Distribuição por categoria"
      description="Participação de cada área da base de conhecimento"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={62}
            outerRadius={100}
            paddingAngle={2}
            animationDuration={700}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {data.map((entry, index) => (
          <li
            key={entry.name}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              className="size-2.5 rounded-full"
              style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            {entry.name}
            <span className="ml-auto font-medium text-foreground">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
