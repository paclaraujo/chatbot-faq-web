import { CONFIDENCE_THRESHOLD, searchFaq, type FaqCategory } from "./faq-data";

export type BotAnswer = {
  content: string;
  faqId: string | null;
  category: FaqCategory | "Sem categoria";
  resolved: boolean;
  score: number;
  suggestions: string[];
};

export function answerQuestion(question: string): BotAnswer {
  const matches = searchFaq(question, 3);
  const best = matches[0];

  if (!best || best.score < CONFIDENCE_THRESHOLD) {
    const suggestions = matches.map((m) => m.entry.question);
    return {
      content:
        "Ainda não tenho uma resposta cadastrada para essa pergunta. Registrei a dúvida para que a equipe adicione o conteúdo à base de conhecimento." +
        (suggestions.length > 0 ? "\nEnquanto isso, talvez estes tópicos ajudem:" : ""),
      faqId: null,
      category: "Sem categoria",
      resolved: false,
      score: best?.score ?? 0,
      suggestions,
    };
  }

  return {
    content: best.entry.answer,
    faqId: best.entry.id,
    category: best.entry.category,
    resolved: true,
    score: best.score,
    suggestions: matches.slice(1).map((m) => m.entry.question),
  };
}
