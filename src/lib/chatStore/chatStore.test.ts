import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  appendMessages,
  createThread,
  deleteThread,
  getOrCreateActiveThread,
  getThread,
  getThreads,
  saveThreads,
  subscribeToStore,
  uid,
  updateThread,
  type ChatMessage,
  type Thread,
} from "@/lib/chatStore";

function makeThread(overrides: Partial<Thread> = {}): Thread {
  return {
    id: uid("thr"),
    title: "Nova conversa",
    createdAt: 1,
    updatedAt: 1,
    messages: [],
    ...overrides,
  };
}

describe("chatStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("uid produces distinct ids across calls", () => {
    const ids = new Set(Array.from({ length: 20 }, () => uid("thr")));
    expect(ids.size).toBe(20);
    for (const id of ids) expect(id.startsWith("thr_")).toBe(true);
  });

  it("returns an empty list when there are no threads", () => {
    expect(getThreads()).toEqual([]);
  });

  it("sorts threads by updatedAt descending", () => {
    const older = makeThread({ id: "a", updatedAt: 100 });
    const newer = makeThread({ id: "b", updatedAt: 300 });
    const middle = makeThread({ id: "c", updatedAt: 200 });
    saveThreads([older, newer, middle]);

    expect(getThreads().map((t) => t.id)).toEqual(["b", "c", "a"]);
  });

  it("getThread finds a thread by id", () => {
    const thread = makeThread({ id: "x" });
    saveThreads([thread]);

    expect(getThread("x")).toEqual(thread);
    expect(getThread("missing")).toBeUndefined();
  });

  it("createThread persists a new thread and returns it", () => {
    const thread = createThread();

    expect(thread.title).toBe("Nova conversa");
    expect(thread.messages).toEqual([]);
    expect(getThreads()).toHaveLength(1);
    expect(getThreads()[0].id).toBe(thread.id);
  });

  it("getOrCreateActiveThread reuses the most recent thread", () => {
    const first = createThread();
    const active = getOrCreateActiveThread();

    expect(active.id).toBe(first.id);
    expect(getThreads()).toHaveLength(1);
  });

  it("getOrCreateActiveThread creates a thread when none exists", () => {
    expect(getThreads()).toHaveLength(0);
    const active = getOrCreateActiveThread();

    expect(getThreads()).toHaveLength(1);
    expect(active.id).toBe(getThreads()[0].id);
  });

  it("deleteThread removes only the targeted thread", () => {
    const a = createThread();
    const b = createThread();

    deleteThread(a.id);

    const remaining = getThreads();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(b.id);
  });

  it("updateThread applies the updater to the matching thread", () => {
    const thread = createThread();

    updateThread(thread.id, (t) => ({ ...t, title: "Renomeada" }));

    expect(getThread(thread.id)?.title).toBe("Renomeada");
  });

  it("updateThread is a no-op for an unknown id", () => {
    const thread = createThread();
    updateThread("missing", (t) => ({ ...t, title: "não deveria aplicar" }));

    expect(getThread(thread.id)?.title).toBe("Nova conversa");
  });

  it("appendMessages sets the title from the first user message once", () => {
    const thread = createThread();
    const userMessage: ChatMessage = {
      id: "m1",
      role: "user",
      content: "Como funciona a capa?",
      createdAt: Date.now(),
    };

    appendMessages(thread.id, [userMessage]);

    const updated = getThread(thread.id)!;
    expect(updated.title).toBe("Como funciona a capa?");
    expect(updated.messages).toEqual([userMessage]);

    const secondUserMessage: ChatMessage = {
      id: "m2",
      role: "user",
      content: "Outra pergunta",
      createdAt: Date.now(),
    };
    appendMessages(thread.id, [secondUserMessage]);

    expect(getThread(thread.id)?.title).toBe("Como funciona a capa?");
    expect(getThread(thread.id)?.messages).toHaveLength(2);
  });

  it("appendMessages truncates long first questions to 48 chars for the title", () => {
    const thread = createThread();
    const longQuestion = "P".repeat(80);

    appendMessages(thread.id, [
      { id: "m1", role: "user", content: longQuestion, createdAt: Date.now() },
    ]);

    expect(getThread(thread.id)?.title).toBe(longQuestion.slice(0, 48));
  });

  it("subscribeToStore notifies on writes and storage events, and can unsubscribe", () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToStore(callback);

    createThread();
    expect(callback).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("storage"));
    expect(callback).toHaveBeenCalledTimes(2);

    unsubscribe();
    createThread();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it("read() falls back gracefully when localStorage holds invalid JSON", () => {
    window.localStorage.setItem("faqbot.threads.v1", "{not json");

    expect(getThreads()).toEqual([]);
  });
});
