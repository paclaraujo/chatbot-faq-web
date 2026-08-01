import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { Plus, SendHorizontal, Sparkle, Trash2, Bot, User, HelpCircle } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { RichText } from "@/components/rich-text";
import { useThreads } from "@/hooks/use-threads";
import { ApiError, askQuestion } from "@/lib/api";
import {
  appendMessages,
  createThread,
  deleteThread,
  uid,
  type ChatMessage,
} from "@/lib/chat-store";

export const Route = createFileRoute("/chat/$threadId")({
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
  "Como redefinir minha senha?",
  "Qual o prazo de entrega?",
  "Quais formas de pagamento vocês aceitam?",
  "Como rastreio meu pedido?",
];

function ChatPage() {
  const { threadId } = useParams({ from: "/chat/$threadId" });
  const navigate = useNavigate();
  const { threads, hydrated } = useThreads();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(() => threads.find((t) => t.id === threadId), [threads, threadId]);
  const messages = thread?.messages ?? [];

  useEffect(() => {
    if (hydrated && !thread) {
      const fresh = threads[0] ?? createThread();
      navigate({ to: "/chat/$threadId", params: { threadId: fresh.id }, replace: true });
    }
  }, [hydrated, thread, threads, navigate]);

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

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl border border-border bg-card p-3 shadow-soft lg:block">
          <button
            type="button"
            onClick={() => {
              const created = createThread();
              navigate({ to: "/chat/$threadId", params: { threadId: created.id } });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" aria-hidden />
            Nova conversa
          </button>

          <p className="mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Histórico
          </p>
          <ul className="mt-2 space-y-1">
            {threads.map((item) => (
              <li
                key={item.id}
                className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 transition-colors ${
                  item.id === threadId ? "bg-accent" : "hover:bg-secondary"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate({ to: "/chat/$threadId", params: { threadId: item.id } })
                  }
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="block truncate text-sm text-foreground">{item.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {item.messages.filter((m) => m.role === "user").length} perguntas
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={`Excluir conversa ${item.title}`}
                  onClick={() => {
                    deleteThread(item.id);
                    if (item.id === threadId) {
                      const next = threads.find((t) => t.id !== item.id) ?? createThread();
                      navigate({ to: "/chat/$threadId", params: { threadId: next.id } });
                    }
                  }}
                  className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-card hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </aside>

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

          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
            {messages.length === 0 && (
              <div className="mx-auto max-w-md pt-10 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground">
                  <Bot className="size-6" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  Como posso ajudar hoje?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pergunte em linguagem natural — busco a resposta mais próxima na base de FAQ.
                </p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => send(prompt)}
                      className="rounded-xl border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-secondary"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) =>
              message.role === "user" ? (
                <div key={message.id} className="flex justify-end gap-3">
                  <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                    {message.content}
                  </div>
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="size-4" aria-hidden />
                  </span>
                </div>
              ) : (
                <div key={message.id} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                    <Bot className="size-4" aria-hidden />
                  </span>
                  <div className="max-w-[80%]">
                    <div className="text-sm leading-relaxed text-foreground">
                      <RichText text={message.content} />
                    </div>
                    {message.resolved === false && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                        <HelpCircle className="size-3.5" aria-hidden />
                        Pergunta sem resposta cadastrada
                      </span>
                    )}
                    {message.category && (
                      <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                        <Sparkle className="size-3.5" aria-hidden />
                        {message.category}
                      </span>
                    )}
                  </div>
                </div>
              ),
            )}

            {typing && (
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                  <Bot className="size-4" aria-hidden />
                </span>
                <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSubmit} className="border-t border-border px-4 py-3">
            {error && <p className="mb-2 text-xs text-destructive">{error}</p>}
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 focus-within:border-primary">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={500}
                placeholder="Digite sua pergunta…"
                aria-label="Pergunta"
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={typing || input.trim().length === 0}
                aria-label="Enviar pergunta"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <SendHorizontal className="size-4" aria-hidden />
              </button>
            </div>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
