import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ThreadSidebar } from "@/components/Chat/ThreadSidebar";
import type { Thread } from "@/lib/chatStore";

const THREADS: Thread[] = [
  {
    id: "t1",
    title: "Primeira conversa",
    createdAt: 0,
    updatedAt: 0,
    messages: [
      { id: "m1", role: "user", content: "Oi", createdAt: 0 },
      { id: "m2", role: "assistant", content: "Olá", createdAt: 0 },
    ],
  },
  {
    id: "t2",
    title: "Segunda conversa",
    createdAt: 0,
    updatedAt: 0,
    messages: [],
  },
];

describe("ThreadSidebar", () => {
  it("lists every thread with its question count", () => {
    render(
      <ThreadSidebar
        threads={THREADS}
        activeThreadId="t1"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Primeira conversa")).toBeInTheDocument();
    expect(screen.getByText("1 perguntas")).toBeInTheDocument();
    expect(screen.getByText("Segunda conversa")).toBeInTheDocument();
    expect(screen.getByText("0 perguntas")).toBeInTheDocument();
  });

  it("calls onCreate when starting a new conversation", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(
      <ThreadSidebar
        threads={THREADS}
        activeThreadId="t1"
        onCreate={onCreate}
        onSelect={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Nova conversa" }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it("calls onSelect with the thread id when clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ThreadSidebar
        threads={THREADS}
        activeThreadId="t1"
        onCreate={vi.fn()}
        onSelect={onSelect}
        onDelete={vi.fn()}
      />,
    );

    await user.click(screen.getByText("Segunda conversa"));
    expect(onSelect).toHaveBeenCalledWith("t2");
  });

  it("calls onDelete with the thread id when the delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <ThreadSidebar
        threads={THREADS}
        activeThreadId="t1"
        onCreate={vi.fn()}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Excluir conversa Segunda conversa" }));
    expect(onDelete).toHaveBeenCalledWith("t2");
  });
});
