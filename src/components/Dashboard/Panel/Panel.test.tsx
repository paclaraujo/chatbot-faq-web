import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Panel } from "./index";

describe("Panel", () => {
  it("renders the title, description and children", () => {
    render(
      <Panel title="Título" description="Descrição">
        <p>conteúdo do painel</p>
      </Panel>,
    );

    expect(screen.getByRole("heading", { name: "Título" })).toBeInTheDocument();
    expect(screen.getByText("Descrição")).toBeInTheDocument();
    expect(screen.getByText("conteúdo do painel")).toBeInTheDocument();
  });
});
