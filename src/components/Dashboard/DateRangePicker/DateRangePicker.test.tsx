import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DateRangePicker } from "./index";

describe("DateRangePicker", () => {
  it("renders every range option", () => {
    render(<DateRangePicker days={14} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "7 dias" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "14 dias" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "30 dias" })).toBeInTheDocument();
  });

  it("calls onChange with the selected range's day count", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<DateRangePicker days={14} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "30 dias" }));

    expect(onChange).toHaveBeenCalledWith(30);
  });
});
