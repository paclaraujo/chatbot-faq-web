import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/Home/Footer";

describe("Footer", () => {
  it("renders the brand name and a copyright line with the current year", () => {
    render(<Footer />);

    expect(screen.getByText("INVISÍVEL")).toBeInTheDocument();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${year} Invisível Tech`))).toBeInTheDocument();
  });
});
