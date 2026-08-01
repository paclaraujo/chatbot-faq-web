import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, CheckCircle2, Clock, MessageSquare, TriangleAlert } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getEvents, seedDemoData, subscribeToStore, type InteractionEvent } from "@/lib/chat-store";
import { FAQ_ENTRIES } from "@/lib/faq-data";

export const Route = createFileRoute("/dashboard")({
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

const RANGES = [
  { label: "7 dias", days: 7 },
  { label: "14 dias", days: 14 },
  { label: "30 dias", days: 30 },
];

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--muted-foreground)",
];

function Dashboard() {
  const [events, setEvents] = useState<InteractionEvent[]>([]);
  const [days, setDays] = useState(14);

  useEffect(() => {
    seedDemoData();
    const refresh = () => setEvents(getEvents());
    refresh();
    return subscribeToStore(refresh);
  }, []);

  const data = useMemo(() => {
    const since = Date.now() - days * 86_400_000;
    const scoped = events.filter((e) => e.createdAt >= since);
    const total = scoped.length;
    const resolved = scoped.filter((e) => e.resolved).length;
    const unanswered = total - resolved;
    const avgMs = total
      ? Math.round(scoped.reduce((sum, e) => sum + e.responseMs, 0) / total)
      : 0;

    const byFaq = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byMissing = new Map<string, number>();
    const byDay = new Map<string, { resolvidas: number; semResposta: number }>();

    for (let d = days - 1; d >= 0; d--) {
      const key = new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);
      byDay.set(key, { resolvidas: 0, semResposta: 0 });
    }

    for (const event of scoped) {
      const key = new Date(event.createdAt).toISOString().slice(0, 10);
      const bucket = byDay.get(key);
      if (bucket) {
        if (event.resolved) bucket.resolvidas += 1;
        else bucket.semResposta += 1;
      }
      if (event.resolved && event.faqId) {
        byFaq.set(event.faqId, (byFaq.get(event.faqId) ?? 0) + 1);
        byCategory.set(event.category, (byCategory.get(event.category) ?? 0) + 1);
      } else {
        const q = event.question.trim();
        byMissing.set(q, (byMissing.get(q) ?? 0) + 1);
      }
    }

    const topQuestions = [...byFaq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([faqId, count]) => ({
        name: FAQ_ENTRIES.find((f) => f.id === faqId)?.question ?? faqId,
        count,
      }));

    const categories = [...byCategory.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));

    const missing = [...byMissing.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([question, count]) => ({ question, count }));

    const timeline = [...byDay.entries()].map(([date, value]) => ({
      date: date.slice(8) + "/" + date.slice(5, 7),
      ...value,
    }));

    return { total, resolved, unanswered, avgMs, topQuestions, categories, missing, timeline };
  }, [events, days]);

  const resolutionRate = data.total ? Math.round((data.resolved / data.total) * 100) : 0;

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
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {RANGES.map((range) => (
              <button
                key={range.days}
                type="button"
                onClick={() => setDays(range.days)}
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<MessageSquare className="size-4" aria-hidden />}
            label="Consultas realizadas"
            value={data.total.toLocaleString("pt-BR")}
            hint={`Últimos ${days} dias`}
          />
          <StatCard
            icon={<CheckCircle2 className="size-4" aria-hidden />}
            label="Taxa de resolução"
            value={`${resolutionRate}%`}
            hint={`${data.resolved} respondidas pela base`}
          />
          <StatCard
            icon={<TriangleAlert className="size-4" aria-hidden />}
            label="Sem resposta"
            value={data.unanswered.toLocaleString("pt-BR")}
            hint="Oportunidades de novo conteúdo"
          />
          <StatCard
            icon={<Clock className="size-4" aria-hidden />}
            label="Tempo médio de resposta"
            value={`${data.avgMs} ms`}
            hint="Busca na base de conhecimento"
          />
        </div>

        <Panel
          title="Evolução das consultas"
          description="Volume diário separado entre respondidas e sem resposta"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.timeline} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="grad-ok" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="grad-miss" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
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
                dataKey="resolvidas"
                stroke="var(--chart-1)"
                fill="url(#grad-ok)"
                animationDuration={700}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="semResposta"
                stroke="var(--chart-4)"
                fill="url(#grad-miss)"
                animationDuration={700}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel title="Perguntas mais frequentes" description="Top consultas resolvidas pela base">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.topQuestions}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
                barSize={18}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={190}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  tickFormatter={(value: string) =>
                    value.length > 34 ? `${value.slice(0, 34)}…` : value
                  }
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="count" fill="var(--chart-1)" radius={[0, 6, 6, 0]} animationDuration={700} />
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel
            title="Distribuição por categoria"
            description="Participação de cada área da base de conhecimento"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={100}
                  paddingAngle={2}
                  animationDuration={700}
                >
                  {data.categories.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {data.categories.map((entry, index) => (
                <li key={entry.name} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  {entry.name}
                  <span className="ml-auto font-medium text-foreground">{entry.value}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel
          title="Perguntas sem resposta cadastrada"
          description="Lacunas na base de conhecimento priorizadas por frequência"
        >
          {data.missing.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma lacuna registrada no período.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 font-medium">Pergunta</th>
                  <th className="py-2 text-right font-medium">Ocorrências</th>
                </tr>
              </thead>
              <tbody>
                {data.missing.map((row) => (
                  <tr key={row.question} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5 pr-4 text-foreground">{row.question}</td>
                    <td className="py-2.5 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                        <Activity className="size-3.5" aria-hidden />
                        {row.count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <p className="mb-4 text-xs text-muted-foreground">{description}</p>
      {children}
    </section>
  );
}

function ChartTooltip({
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
