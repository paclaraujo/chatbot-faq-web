import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { QueriesTimelineChart } from "@/components/Dashboard/QueriesTimelineChart";

describe("QueriesTimelineChart", () => {
  it("renders the panel heading and description", () => {
    render(
      <QueriesTimelineChart
        data={[
          { date: "2026-01-01", count: 5 },
          { date: "2026-01-02", count: 8 },
        ]}
      />,
    );

    expect(screen.getByText("Evolução das consultas")).toBeInTheDocument();
    expect(screen.getByText("Volume diário de interações no período")).toBeInTheDocument();
  });

  it("renders without crashing when there is no data", () => {
    render(<QueriesTimelineChart data={[]} />);
    expect(screen.getByText("Evolução das consultas")).toBeInTheDocument();
  });
});
