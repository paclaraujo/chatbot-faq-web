import { createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/AppShell'
import { ErrorBanner } from '@/components/ErrorBanner'
import { CategoryBreakdownChart } from '@/components/Dashboard/CategoryBreakdownChart'
import { DateRangePicker } from '@/components/Dashboard/DateRangePicker'
import { QueriesTimelineChart } from '@/components/Dashboard/QueriesTimelineChart'
import { StatsOverview } from '@/components/Dashboard/StatsOverview'
import { TopQuestionsChart } from '@/components/Dashboard/TopQuestionsChart'
import { UnansweredTable } from '@/components/Dashboard/UnansweredTable'
import { useAnalytics } from '@/hooks/useAnalytics'

export const Route = createFileRoute('/_admin/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { analytics, data, days, setDays, loading, error, resolutionRate } =
    useAnalytics()

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard analítico
            </h1>
            <p className="text-sm text-muted-foreground">
              Métricas de utilização do chatbot e tendências de comportamento
              dos usuários.
            </p>
          </div>
          <DateRangePicker days={days} onChange={setDays} />
        </div>

        {error && <ErrorBanner message={error} />}

        <StatsOverview
          analytics={analytics}
          days={days}
          resolutionRate={resolutionRate}
        />

        <QueriesTimelineChart data={data.timeline} />

        <div className="grid gap-4 lg:grid-cols-2">
          <TopQuestionsChart data={data.topQuestions} />
          <CategoryBreakdownChart data={data.categories} />
        </div>

        <UnansweredTable rows={data.missing} loading={loading} />
      </div>
    </AppShell>
  )
}
