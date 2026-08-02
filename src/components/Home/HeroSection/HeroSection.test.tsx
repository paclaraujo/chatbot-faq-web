import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "./index";

describe("HeroSection", () => {
  it("renders the headline, feature highlights and call-to-action links", () => {
    render(<HeroSection />);

    expect(screen.getByRole("heading", { name: /Capa de\s*Invisibilidade/ })).toBeInTheDocument();
    expect(screen.getByText("100% Invisível")).toBeInTheDocument();
    expect(screen.getByText("Tecnologia Avançada")).toBeInTheDocument();
    expect(screen.getByText("Leve e Confortável")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /Comprar agora/ })).toHaveAttribute(
      "href",
      "#produtos",
    );
    expect(screen.getByRole("link", { name: /Saiba mais/ })).toHaveAttribute("href", "#duvidas");
  });
});
