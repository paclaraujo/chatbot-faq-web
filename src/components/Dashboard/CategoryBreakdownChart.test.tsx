import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CategoryBreakdownChart } from "@/components/Dashboard/CategoryBreakdownChart";

describe("CategoryBreakdownChart", () => {
  it("renders the panel heading and a legend entry per category", () => {
    render(
      <CategoryBreakdownChart
        data={[
          { name: "conta", value: 40 },
          { name: "pagamento", value: 15 },
        ]}
      />,
    );

    expect(screen.getByText("Distribuição por categoria")).toBeInTheDocument();
    expect(screen.getByText("conta")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("pagamento")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });

  it("renders without a legend when there is no data", () => {
    render(<CategoryBreakdownChart data={[]} />);
    expect(screen.getByText("Distribuição por categoria")).toBeInTheDocument();
  });
});
