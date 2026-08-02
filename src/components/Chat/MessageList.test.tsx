import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MessageList } from "@/components/Chat/MessageList";
import type { ChatMessage } from "@/lib/chatStore";

function renderList(overrides: Partial<React.ComponentProps<typeof MessageList>> = {}) {
  const bottomRef = createRef<HTMLDivElement>();
  const onQuickPrompt = vi.fn();
  const props: React.ComponentProps<typeof MessageList> = {
    messages: [],
    typing: false,
    quickPrompts: [],
    onQuickPrompt,
    bottomRef,
    ...overrides,
  };
  render(<MessageList {...props} />);
  return { onQuickPrompt };
}

describe("MessageList", () => {
  it("shows the empty state with quick prompts when there are no messages", async () => {
    const user = userEvent.setup();
    const { onQuickPrompt } = renderList({ quickPrompts: ["Funciona no escuro?"] });

    expect(screen.getByText("Como posso ajudar hoje?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Funciona no escuro?" }));
    expect(onQuickPrompt).toHaveBeenCalledWith("Funciona no escuro?");
  });

  it("renders user messages right-aligned with their content", () => {
    const messages: ChatMessage[] = [
      { id: "1", role: "user", content: "Olá!", createdAt: Date.now() },
    ];
    renderList({ messages });

    expect(screen.getByText("Olá!")).toBeInTheDocument();
    expect(screen.queryByText("Como posso ajudar hoje?")).not.toBeInTheDocument();
  });

  it("renders assistant messages with rich text and a category badge", () => {
    const messages: ChatMessage[] = [
      {
        id: "2",
        role: "assistant",
        content: "Sim, **funciona**.",
        createdAt: Date.now(),
        category: "geral",
        resolved: true,
      },
    ];
    renderList({ messages });

    expect(screen.getByText("funciona").tagName).toBe("STRONG");
    expect(screen.getByText("geral")).toBeInTheDocument();
    expect(screen.queryByText("Pergunta sem resposta cadastrada")).not.toBeInTheDocument();
  });

  it("flags unresolved assistant messages", () => {
    const messages: ChatMessage[] = [
      {
        id: "3",
        role: "assistant",
        content: "Não encontrei uma resposta.",
        createdAt: Date.now(),
        resolved: false,
      },
    ];
    renderList({ messages });

    expect(screen.getByText("Pergunta sem resposta cadastrada")).toBeInTheDocument();
  });

  it("shows a typing indicator when typing is true", () => {
    const { container } = render(
      <MessageList
        messages={[]}
        typing
        quickPrompts={[]}
        onQuickPrompt={vi.fn()}
        bottomRef={createRef<HTMLDivElement>()}
      />,
    );

    expect(container.querySelectorAll(".animate-bounce")).toHaveLength(3);
  });
});
