import { useNavigate } from "@tanstack/react-router";
import { createThread, getOrCreateActiveThread } from "@/lib/chat-store";

/** Navigation shortcuts into the public chat, used by the marketing home page. */
export function useStartChat() {
  const navigate = useNavigate();

  function openChat() {
    const thread = getOrCreateActiveThread();
    navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
  }

  function askQuestion(question: string) {
    const thread = createThread();
    navigate({
      to: "/chat/$threadId",
      params: { threadId: thread.id },
      search: { q: question },
    });
  }

  return { openChat, askQuestion };
}
