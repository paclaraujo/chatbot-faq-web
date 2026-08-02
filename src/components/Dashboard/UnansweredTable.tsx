import { Activity } from "lucide-react";

import { Panel } from "@/components/Dashboard/Panel";
import type { AnalyticsUnanswered } from "@/lib/api";

const DATETIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function UnansweredTable({
  rows,
  loading,
}: {
  rows: AnalyticsUnanswered[];
  loading: boolean;
}) {
  return (
    <Panel
      title="Perguntas sem resposta cadastrada"
      description="Lacunas na base de conhecimento priorizadas por frequência"
    >
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Carregando…</p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma lacuna registrada no período.
        </p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="py-2 font-medium">Pergunta</th>
              <th className="py-2 font-medium">Última vez</th>
              <th className="py-2 text-right font-medium">Ocorrências</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.question} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 pr-4 text-foreground">{row.question}</td>
                <td className="py-2.5 pr-4 text-muted-foreground">
                  {DATETIME_FORMATTER.format(new Date(row.lastAskedAt))}
                </td>
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
  );
}
