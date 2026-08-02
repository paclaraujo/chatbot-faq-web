import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuthGuard } from "@/hooks/useAuthGuard";
import { ApiError, getAnalytics, type AnalyticsDashboard } from "@/lib/api";
import { getToken } from "@/lib/authStore";

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });

export type AnalyticsViewModel = {
  topQuestions: { name: string; count: number }[];
  categories: { name: string; value: number }[];
  missing: AnalyticsDashboard["unanswered"];
  timeline: { date: string; count: number }[];
};

const EMPTY_DATA: AnalyticsViewModel = { topQuestions: [], categories: [], missing: [], timeline: [] };

export function useAnalytics() {
  const handleAuthError = useAuthGuard("/dashboard");
  const [analytics, setAnalytics] = useState<AnalyticsDashboard | null>(null);
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics(token, {
        timelineDays: days,
        topLimit: 6,
        unansweredLimit: 6,
      });
      setAnalytics(data);
    } catch (err) {
      if (handleAuthError(err)) return;
      setError(err instanceof ApiError ? err.message : "Não foi possível carregar as métricas.");
    } finally {
      setLoading(false);
    }
  }, [days, handleAuthError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const data = useMemo<AnalyticsViewModel>(() => {
    if (!analytics) return EMPTY_DATA;
    return {
      topQuestions: analytics.topQuestions.map((q) => ({ name: q.question, count: q.count })),
      categories: analytics.byCategory.map((c) => ({ name: c.category, value: c.count })),
      missing: analytics.unanswered,
      timeline: analytics.timeline.map((point) => ({
        date: DATE_FORMATTER.format(new Date(point.date)),
        count: point.count,
      })),
    };
  }, [analytics]);

  const resolutionRate = analytics ? Math.round(analytics.matchRate * 100) : 0;

  return { analytics, data, days, setDays, loading, error, resolutionRate };
}
