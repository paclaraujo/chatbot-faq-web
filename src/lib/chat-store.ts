export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
  /** FAQ entry that answered this message, when resolved. */
  faqId?: string;
  category?: string;
  resolved?: boolean;
};

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

const THREADS_KEY = "faqbot.threads.v1";

export const isBrowser = () => typeof window !== "undefined";

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.error(`Falha ao ler ${key} do armazenamento local`, error);
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("faqbot:store-changed", { detail: key }));
  } catch (error) {
    console.error(`Falha ao gravar ${key} no armazenamento local`, error);
  }
}

/* ---------------------------------- threads --------------------------------- */

export function getThreads(): Thread[] {
  return read<Thread[]>(THREADS_KEY, []).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getThread(id: string): Thread | undefined {
  return getThreads().find((t) => t.id === id);
}

export function saveThreads(threads: Thread[]): void {
  write(THREADS_KEY, threads);
}

export function createThread(): Thread {
  const now = Date.now();
  const thread: Thread = {
    id: uid("thr"),
    title: "Nova conversa",
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  saveThreads([thread, ...getThreads()]);
  return thread;
}

export function deleteThread(id: string): void {
  saveThreads(getThreads().filter((t) => t.id !== id));
}

export function updateThread(id: string, updater: (thread: Thread) => Thread): void {
  const threads = getThreads();
  const index = threads.findIndex((t) => t.id === id);
  if (index === -1) return;
  threads[index] = updater(threads[index]);
  saveThreads(threads);
}

export function appendMessages(threadId: string, messages: ChatMessage[]): void {
  updateThread(threadId, (thread) => {
    const firstUser = thread.messages.find((m) => m.role === "user") ?? messages.find((m) => m.role === "user");
    return {
      ...thread,
      title:
        thread.title === "Nova conversa" && firstUser
          ? firstUser.content.slice(0, 48)
          : thread.title,
      messages: [...thread.messages, ...messages],
      updatedAt: Date.now(),
    };
  });
}

export function subscribeToStore(callback: () => void): () => void {
  if (!isBrowser()) return () => {};
  const handler = () => callback();
  window.addEventListener("faqbot:store-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("faqbot:store-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
