import { FAQ_ENTRIES } from "./faq-data";

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

export type InteractionEvent = {
  id: string;
  threadId: string;
  question: string;
  faqId: string | null;
  /** Pergunta canônica da FAQ que respondeu, quando resolvida. */
  faqQuestion: string | null;
  category: string;
  resolved: boolean;
  responseMs: number;
  createdAt: number;
};

const THREADS_KEY = "faqbot.threads.v1";
const EVENTS_KEY = "faqbot.events.v1";
const SEED_KEY = "faqbot.seeded.v1";

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

/* ---------------------------------- events ---------------------------------- */

export function getEvents(): InteractionEvent[] {
  return read<InteractionEvent[]>(EVENTS_KEY, []);
}

export function logEvent(event: InteractionEvent): void {
  write(EVENTS_KEY, [...getEvents(), event]);
}

export function clearAll(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(THREADS_KEY);
  window.localStorage.removeItem(EVENTS_KEY);
  window.localStorage.removeItem(SEED_KEY);
  window.dispatchEvent(new CustomEvent("faqbot:store-changed"));
}

/* ------------------------------- demo seeding ------------------------------- */

const UNANSWERED_SAMPLES = [
  "Vocês têm loja física em Curitiba?",
  "Qual o CNPJ da empresa?",
  "Posso parcelar em 18x sem juros?",
  "Existe programa de indicação de amigos?",
  "Vocês entregam no exterior?",
];

/** Populates 30 days of realistic demo analytics on first visit. */
export function seedDemoData(): void {
  if (!isBrowser() || window.localStorage.getItem(SEED_KEY)) return;

  const events: InteractionEvent[] = [];
  const now = Date.now();
  const day = 86_400_000;
  const weights = FAQ_ENTRIES.map((_, i) => 1 + Math.max(0, 6 - i * 0.35));

  for (let d = 29; d >= 0; d--) {
    const base = 6 + Math.round(Math.sin((29 - d) / 3) * 3) + Math.round((29 - d) / 4);
    const count = Math.max(3, base + Math.floor(Math.random() * 5));
    for (let i = 0; i < count; i++) {
      const unanswered = Math.random() < 0.14;
      const createdAt = now - d * day + Math.floor(Math.random() * day * 0.9);
      if (unanswered) {
        events.push({
          id: uid("evt"),
          threadId: "seed",
          question: UNANSWERED_SAMPLES[Math.floor(Math.random() * UNANSWERED_SAMPLES.length)],
          faqId: null,
          faqQuestion: null,
          category: "Sem categoria",
          resolved: false,
          responseMs: 180 + Math.floor(Math.random() * 320),
          createdAt,
        });
        continue;
      }
      const total = weights.reduce((a, b) => a + b, 0);
      let pick = Math.random() * total;
      let index = 0;
      for (let k = 0; k < weights.length; k++) {
        pick -= weights[k];
        if (pick <= 0) {
          index = k;
          break;
        }
      }
      const entry = FAQ_ENTRIES[index];
      events.push({
        id: uid("evt"),
        threadId: "seed",
        question: entry.question,
        faqId: entry.id,
        faqQuestion: entry.question,
        category: entry.category,
        resolved: true,
        responseMs: 120 + Math.floor(Math.random() * 260),
        createdAt,
      });
    }
  }

  write(EVENTS_KEY, [...events, ...getEvents()]);
  window.localStorage.setItem(SEED_KEY, "1");
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
