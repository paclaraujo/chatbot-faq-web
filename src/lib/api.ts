const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export type ChatFaqRef = {
  id: number;
  question: string;
  category: string;
};

export type ChatApiResponse =
  | { matched: true; answer: string; faq: ChatFaqRef }
  | { matched: false; answer: null; message: string };

export class ChatApiError extends Error {}

export async function askQuestion(question: string): Promise<ChatApiResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch {
    throw new ChatApiError(
      `Não foi possível conectar à API em ${API_BASE_URL}. Verifique se ela está rodando.`,
    );
  }

  if (!response.ok) {
    let message = `A API retornou um erro (${response.status}).`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      message = body.message ?? body.error ?? message;
    } catch {
      // resposta sem corpo JSON, mantém a mensagem padrão
    }
    throw new ChatApiError(message);
  }

  return (await response.json()) as ChatApiResponse;
}
