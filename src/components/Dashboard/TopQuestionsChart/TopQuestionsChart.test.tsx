import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TopQuestionsChart } from "./index";

describe("TopQuestionsChart", () => {
  it("renders the panel heading and description", () => {
    render(
      <TopQuestionsChart
        data={[
          { name: "Como troco a senha?", count: 10 },
          { name: "Funciona no escuro?", count: 6 },
        ]}
      />,
    );

    expect(screen.getByText("Perguntas mais frequentes")).toBeInTheDocument();
    expect(screen.getByText("Top consultas resolvidas pela base")).toBeInTheDocument();
  });

  it("renders without crashing when there is no data", () => {
    render(<TopQuestionsChart data={[]} />);
    expect(screen.getByText("Perguntas mais frequentes")).toBeInTheDocument();
  });

  it("renders without crashing when a question name is very long", () => {
    render(
      <TopQuestionsChart
        data={[{ name: "Uma pergunta extremamente longa que ultrapassa o limite de caracteres exibido no eixo", count: 3 }]}
      />,
    );
    expect(screen.getByText("Perguntas mais frequentes")).toBeInTheDocument();
  });
});
