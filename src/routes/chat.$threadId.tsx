import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Composer } from "@/components/Chat/Composer";
import { MessageList } from "@/components/Chat/MessageList";
import { ThreadSidebar } from "@/components/Chat/ThreadSidebar";
import { useThreads } from "@/hooks/useThreads";
import { ApiError, askQuestion } from "@/lib/api";
import { appendMessages, createThread, deleteThread, uid, type ChatMessage } from "@/lib/chatStore";

type ChatSearch = { q?: string };

export const Route = createFileRoute("/chat/$threadId")({
  validateSearch: (search: Record<string, unknown>): ChatSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Conversa — Atlas FAQ" },
      {
        name: "description",
        content:
          "Converse com o assistente de FAQ e consulte respostas da base de conhecimento em segundos.",
      },
      { property: "og:title", content: "Conversa — Atlas FAQ" },
      {
        property: "og:description",
        content: "Assistente automatizado de perguntas frequentes com histórico de conversas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const QUICK_PROMPTS = [
  "Por que ainda consigo me ver?",
  "Funciona em espelhos?",
  "Meu gato consegue me enxergar?",
  "A invisibilidade funciona no escuro?",
];

function ChatPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { threads, hydrated } = useThreads();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoAskedRef = useRef(false);

  const thread = useMemo(() => threads.find((t) => t.id === threadId), [threads, threadId]);
  const messages = thread?.messages ?? [];

  const goToThread = useCallback(
    (id: string, replace = false) => navigate({ to: "/chat/$threadId", params: { threadId: id }, replace }),
    [navigate],
  );

  useEffect(() => {
    if (hydrated && !thread) {
      const fresh = threads[0] ?? createThread();
      goToThread(fresh.id, true);
    }
  }, [hydrated, thread, threads, goToThread]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [threadId, typing]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, typing]);

  const send = useCallback(
    (raw: string) => {
      const question = raw.trim();
      if (!question || typing) return;
      if (question.length > 500) {
        setError("A pergunta deve ter no máximo 500 caracteres.");
        return;
      }
      setError(null);
      setInput("");

      const userMessage: ChatMessage = {
        id: uid("msg"),
        role: "user",
        content: question,
        createdAt: Date.now(),
      };
      appendMessages(threadId, [userMessage]);
      setTyping(true);

      askQuestion(question)
        .then((data) => {
          const faqId = data.matched ? String(data.faq.id) : undefined;
          const category = data.matched ? data.faq.category : undefined;
          const content = data.matched ? data.answer : data.message;

          appendMessages(threadId, [
            {
              id: uid("msg"),
              role: "assistant",
              content,
              createdAt: Date.now(),
              faqId,
              category,
              resolved: data.matched,
            },
          ]);
        })
        .catch((err) => {
          console.error(err);
          setError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível processar a pergunta. Tente novamente.",
          );
        })
        .finally(() => setTyping(false));
    },
    [threadId, typing],
  );

  useEffect(() => {
    if (autoAskedRef.current || !thread || !search.q) return;
    if (thread.messages.length > 0) return;
    autoAskedRef.current = true;
    send(search.q);
    goToThread(threadId, true);
  }, [thread, search.q, send, goToThread, threadId]);

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <ThreadSidebar
          threads={threads}
          activeThreadId={threadId}
          onCreate={() => goToThread(createThread().id)}
          onSelect={(id) => goToThread(id)}
          onDelete={(id) => {
            deleteThread(id);
            if (id === threadId) {
              const next = threads.find((t) => t.id !== id) ?? createThread();
              goToThread(next.id);
            }
          }}
        />

        <section className="flex h-[calc(100vh-8.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {thread?.title ?? "Nova conversa"}
              </h1>
              <p className="text-xs text-muted-foreground">
                Respostas buscadas em tempo real na base de conhecimento
              </p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-chart-5" aria-hidden />
              Online
            </span>
          </div>

          <MessageList
            messages={messages}
            typing={typing}
            quickPrompts={QUICK_PROMPTS}
            onQuickPrompt={send}
            bottomRef={bottomRef}
          />

          <Composer
            value={input}
            onChange={setInput}
            onSend={() => send(input)}
            typing={typing}
            error={error}
            textareaRef={textareaRef}
          />
        </section>
      </div>
    </AppShell>
  );
}
