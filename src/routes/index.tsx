import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createThread, getThreads, isBrowser, seedDemoData } from "@/lib/chat-store";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas FAQ — Chatbot de perguntas frequentes" },
      {
        name: "description",
        content:
          "Chatbot de FAQ com busca inteligente na base de conhecimento e dashboard analítico de atendimentos.",
      },
      { property: "og:title", content: "Atlas FAQ — Chatbot de perguntas frequentes" },
      {
        property: "og:description",
        content:
          "Tire dúvidas em segundos com o chatbot de FAQ e acompanhe as métricas de atendimento no dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isBrowser()) return;
    seedDemoData();
    const existing = getThreads();
    const thread = existing[0] ?? createThread();
    navigate({ to: "/chat/$threadId", params: { threadId: thread.id }, replace: true });
  }, [navigate]);

  return (
    <AppShell>
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Carregando o assistente…</p>
      </div>
    </AppShell>
  );
}

