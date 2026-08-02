import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

import { Header } from "@/components/Home/Header";

describe("Header", () => {
  it("links the brand to home and the CTA to the dashboard", () => {
    render(<Header />);

    expect(screen.getByText("INVISÍVEL")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /INVISÍVEL/ })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /Área Logada/ })).toHaveAttribute(
      "href",
      "/dashboard",
    );
  });
});
