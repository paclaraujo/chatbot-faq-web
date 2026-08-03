import {
  Activity,
  CheckCircle2,
  MessageSquare,
  TriangleAlert,
} from 'lucide-react'

import { StatCard } from '@/components/Dashboard/StatCard'
import type { AnalyticsDashboard } from '@/lib/api'

export function StatsOverview({
  analytics,
  days,
  resolutionRate,
  loading,
}: {
  analytics: AnalyticsDashboard | null
  days: number
  resolutionRate: number
  loading?: boolean
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        loading={loading}
        icon={<MessageSquare className="size-4" aria-hidden />}
        label="Consultas realizadas"
        value={(analytics?.totalInteractions ?? 0).toLocaleString('pt-BR')}
        hint={`Últimos ${days} dias`}
      />
      <StatCard
        loading={loading}
        icon={<CheckCircle2 className="size-4" aria-hidden />}
        label="Taxa de resolução"
        value={`${resolutionRate}%`}
        hint={`${(analytics?.totalMatched ?? 0).toLocaleString('pt-BR')} respondidas pela base`}
      />
      <StatCard
        loading={loading}
        icon={<TriangleAlert className="size-4" aria-hidden />}
        label="Sem resposta"
        value={(analytics?.totalUnmatched ?? 0).toLocaleString('pt-BR')}
        hint="Oportunidades de novo conteúdo"
      />
      <StatCard
        loading={loading}
        icon={<Activity className="size-4" aria-hidden />}
        label="Lacunas distintas"
        value={(analytics?.unanswered.length ?? 0).toLocaleString('pt-BR')}
        hint="Perguntas diferentes sem resposta"
      />
    </div>
  )
}
