import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UnansweredTable } from "@/components/Dashboard/UnansweredTable";
import type { AnalyticsUnanswered } from "@/lib/api";

describe("UnansweredTable", () => {
  it("shows a loading message while loading", () => {
    render(<UnansweredTable rows={[]} loading />);
    expect(screen.getByText("Carregando…")).toBeInTheDocument();
  });

  it("shows an empty state when there are no rows", () => {
    render(<UnansweredTable rows={[]} loading={false} />);
    expect(screen.getByText("Nenhuma lacuna registrada no período.")).toBeInTheDocument();
  });

  it("renders each unanswered question with its occurrence count", () => {
    const rows: AnalyticsUnanswered[] = [
      { question: "Funciona na chuva?", count: 5, lastAskedAt: "2026-01-15T10:30:00Z" },
    ];
    render(<UnansweredTable rows={rows} loading={false} />);

    expect(screen.getByText("Funciona na chuva?")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
