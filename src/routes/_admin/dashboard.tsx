import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { ErrorBanner } from "@/components/error-banner";
import { CategoryBreakdownChart } from "@/components/dashboard/category-breakdown-chart";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { QueriesTimelineChart } from "@/components/dashboard/queries-timeline-chart";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { TopQuestionsChart } from "@/components/dashboard/top-questions-chart";
import { UnansweredTable } from "@/components/dashboard/unanswered-table";
import { useAnalytics } from "@/hooks/use-analytics";

export const Route = createFileRoute("/_admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard analítico — Atlas FAQ" },
      {
        name: "description",
        content:
          "Indicadores de atendimento do chatbot: volume de consultas, perguntas mais frequentes, lacunas na base e evolução no tempo.",
      },
      { property: "og:title", content: "Dashboard analítico — Atlas FAQ" },
      {
        property: "og:description",
        content: "Métricas de uso do chatbot de FAQ e tendências de comportamento dos usuários.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { analytics, data, days, setDays, loading, error, resolutionRate } = useAnalytics();

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard analítico
            </h1>
            <p className="text-sm text-muted-foreground">
              Métricas de utilização do chatbot e tendências de comportamento dos usuários.
            </p>
          </div>
          <DateRangePicker days={days} onChange={setDays} />
        </div>

        {error && <ErrorBanner message={error} />}

        <StatsOverview analytics={analytics} days={days} resolutionRate={resolutionRate} />

        <QueriesTimelineChart data={data.timeline} />

        <div className="grid gap-4 lg:grid-cols-2">
          <TopQuestionsChart data={data.topQuestions} />
          <CategoryBreakdownChart data={data.categories} />
        </div>

        <UnansweredTable rows={data.missing} loading={loading} />
      </div>
    </AppShell>
  );
}
