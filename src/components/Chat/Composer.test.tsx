import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Composer } from "@/components/Chat/Composer";

function setup(overrides: Partial<React.ComponentProps<typeof Composer>> = {}) {
  const onChange = vi.fn();
  const onSend = vi.fn();
  const textareaRef = createRef<HTMLTextAreaElement>();
  const props: React.ComponentProps<typeof Composer> = {
    value: "",
    onChange,
    onSend,
    typing: false,
    error: null,
    textareaRef,
    ...overrides,
  };
  render(<Composer {...props} />);
  return { onChange, onSend };
}

describe("Composer", () => {
  it("disables the send button while empty", () => {
    setup({ value: "" });
    expect(screen.getByRole("button", { name: "Enviar pergunta" })).toBeDisabled();
  });

  it("enables the send button once there is text", () => {
    setup({ value: "Oi" });
    expect(screen.getByRole("button", { name: "Enviar pergunta" })).toBeEnabled();
  });

  it("disables the send button while a response is typing", () => {
    setup({ value: "Oi", typing: true });
    expect(screen.getByRole("button", { name: "Enviar pergunta" })).toBeDisabled();
  });

  it("calls onChange as the user types", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    await user.type(screen.getByLabelText("Pergunta"), "Oi");

    expect(onChange).toHaveBeenCalled();
  });

  it("submits on Enter without shift", async () => {
    const user = userEvent.setup();
    const { onSend } = setup({ value: "Oi" });

    screen.getByLabelText("Pergunta").focus();
    await user.keyboard("{Enter}");

    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("does not submit on Shift+Enter", async () => {
    const user = userEvent.setup();
    const { onSend } = setup({ value: "Oi" });

    screen.getByLabelText("Pergunta").focus();
    await user.keyboard("{Shift>}{Enter}{/Shift}");

    expect(onSend).not.toHaveBeenCalled();
  });

  it("submits when the send button is clicked", async () => {
    const user = userEvent.setup();
    const { onSend } = setup({ value: "Oi" });

    await user.click(screen.getByRole("button", { name: "Enviar pergunta" }));

    expect(onSend).toHaveBeenCalledTimes(1);
  });

  it("shows the error message when provided", () => {
    setup({ error: "Falha ao enviar" });
    expect(screen.getByText("Falha ao enviar")).toBeInTheDocument();
  });
});
