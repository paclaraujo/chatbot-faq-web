export type FaqCategory =
  | "Conta e Acesso"
  | "Pagamentos"
  | "Envio e Entrega"
  | "Produtos"
  | "Suporte Técnico"
  | "Privacidade";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  keywords: string[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  "Conta e Acesso",
  "Pagamentos",
  "Envio e Entrega",
  "Produtos",
  "Suporte Técnico",
  "Privacidade",
];

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "acc-1",
    question: "Como faço para redefinir minha senha?",
    answer:
      "Acesse a tela de login e clique em **Esqueci minha senha**. Informe o e-mail cadastrado e você receberá um link de redefinição válido por 30 minutos. Caso não encontre o e-mail, verifique a caixa de spam.",
    category: "Conta e Acesso",
    keywords: ["senha", "redefinir", "esqueci", "login", "acesso", "reset", "password"],
  },
  {
    id: "acc-2",
    question: "Como altero meu e-mail cadastrado?",
    answer:
      "Vá em **Perfil → Dados da conta → Editar e-mail**. Por segurança, enviaremos um código de confirmação para o e-mail antigo e para o novo endereço.",
    category: "Conta e Acesso",
    keywords: ["email", "e-mail", "alterar", "trocar", "cadastro", "conta"],
  },
  {
    id: "acc-3",
    question: "Como ativo a autenticação em dois fatores?",
    answer:
      "Em **Perfil → Segurança**, ative a opção 2FA e escaneie o QR Code com um aplicativo autenticador (Google Authenticator, Authy). Guarde os códigos de recuperação em local seguro.",
    category: "Conta e Acesso",
    keywords: ["2fa", "dois fatores", "autenticação", "segurança", "qr code", "mfa"],
  },
  {
    id: "pay-1",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito (Visa, Mastercard, Elo, Amex), Pix, boleto bancário e carteira digital. Pagamentos por Pix são confirmados em até 5 minutos.",
    category: "Pagamentos",
    keywords: ["pagamento", "cartão", "pix", "boleto", "formas", "pagar", "crédito"],
  },
  {
    id: "pay-2",
    question: "Como emito a segunda via do boleto?",
    answer:
      "Acesse **Meus pedidos**, selecione o pedido em aberto e clique em **Segunda via do boleto**. O novo boleto é gerado com vencimento para o próximo dia útil.",
    category: "Pagamentos",
    keywords: ["boleto", "segunda via", "2 via", "vencimento", "emitir"],
  },
  {
    id: "pay-3",
    question: "Em quanto tempo recebo o reembolso?",
    answer:
      "Após a aprovação do cancelamento, o reembolso ocorre em até 5 dias úteis para Pix e em até 2 faturas para cartão de crédito, conforme a política da operadora.",
    category: "Pagamentos",
    keywords: ["reembolso", "estorno", "devolução", "dinheiro", "cancelamento", "prazo"],
  },
  {
    id: "pay-4",
    question: "Como emito a nota fiscal da minha compra?",
    answer:
      "A nota fiscal é enviada por e-mail em até 48h após a confirmação do pagamento e também fica disponível em **Meus pedidos → Detalhes → Baixar NF-e**.",
    category: "Pagamentos",
    keywords: ["nota fiscal", "nfe", "nf", "fatura", "recibo", "imposto"],
  },
  {
    id: "ship-1",
    question: "Qual o prazo de entrega dos pedidos?",
    answer:
      "O prazo padrão é de 3 a 7 dias úteis para capitais e de 5 a 12 dias úteis para demais regiões, contados a partir da confirmação do pagamento.",
    category: "Envio e Entrega",
    keywords: ["prazo", "entrega", "demora", "chegar", "frete", "dias", "envio"],
  },
  {
    id: "ship-2",
    question: "Como rastreio meu pedido?",
    answer:
      "Em **Meus pedidos**, clique em **Rastrear**. O código de rastreio também é enviado por e-mail assim que o pedido é despachado.",
    category: "Envio e Entrega",
    keywords: ["rastrear", "rastreio", "código", "onde está", "pedido", "tracking"],
  },
  {
    id: "ship-3",
    question: "Posso alterar o endereço de entrega após a compra?",
    answer:
      "Sim, desde que o pedido ainda não tenha sido despachado. Acesse **Meus pedidos → Alterar endereço** ou fale com o suporte em até 2 horas após a compra.",
    category: "Envio e Entrega",
    keywords: ["endereço", "alterar", "mudar", "entrega", "cep"],
  },
  {
    id: "prod-1",
    question: "Os produtos possuem garantia?",
    answer:
      "Todos os produtos têm garantia legal de 90 dias e garantia contratual do fabricante de 12 meses contra defeitos de fabricação.",
    category: "Produtos",
    keywords: ["garantia", "defeito", "fabricante", "meses", "troca"],
  },
  {
    id: "prod-2",
    question: "Como solicito a troca de um produto?",
    answer:
      "Você tem 7 dias corridos após o recebimento para solicitar troca ou devolução. Abra a solicitação em **Meus pedidos → Solicitar troca** e imprima a etiqueta de postagem gratuita.",
    category: "Produtos",
    keywords: ["troca", "trocar", "devolver", "devolução", "arrependimento", "etiqueta"],
  },
  {
    id: "tech-1",
    question: "O aplicativo está travando, o que fazer?",
    answer:
      "Atualize para a versão mais recente, limpe o cache do app e reinicie o dispositivo. Se o problema persistir, envie o log em **Ajuda → Reportar problema**.",
    category: "Suporte Técnico",
    keywords: ["travando", "bug", "erro", "app", "aplicativo", "lento", "crash"],
  },
  {
    id: "tech-2",
    question: "Como integro a API à minha aplicação?",
    answer:
      "Gere uma chave em **Configurações → Desenvolvedor → API Keys** e envie-a no header `Authorization: Bearer <token>`. A documentação completa está em /docs/api com exemplos em cURL, Node e Python.",
    category: "Suporte Técnico",
    keywords: ["api", "integração", "token", "chave", "webhook", "documentação", "rest"],
  },
  {
    id: "tech-3",
    question: "Quais navegadores são suportados?",
    answer:
      "Suportamos as duas últimas versões de Chrome, Edge, Firefox e Safari. Recursos em tempo real exigem WebSocket habilitado.",
    category: "Suporte Técnico",
    keywords: ["navegador", "browser", "chrome", "safari", "firefox", "compatibilidade"],
  },
  {
    id: "priv-1",
    question: "Como meus dados pessoais são tratados?",
    answer:
      "Seguimos a LGPD. Os dados são usados apenas para execução do serviço, armazenados de forma criptografada e nunca vendidos a terceiros.",
    category: "Privacidade",
    keywords: ["dados", "lgpd", "privacidade", "pessoais", "segurança", "tratamento"],
  },
  {
    id: "priv-2",
    question: "Como solicito a exclusão da minha conta?",
    answer:
      "Envie a solicitação em **Perfil → Privacidade → Excluir conta**. A exclusão é concluída em até 15 dias, mantendo apenas os dados exigidos por obrigação legal.",
    category: "Privacidade",
    keywords: ["excluir", "deletar", "apagar", "conta", "cancelar", "remover"],
  },
];

const STOPWORDS = new Set([
  "a","o","as","os","um","uma","de","do","da","dos","das","em","no","na","nos","nas","por","para",
  "com","sem","que","qual","quais","como","onde","quando","meu","minha","meus","minhas","eu","se",
  "é","e","ao","à","the","of","to","is","posso","fazer","faço","ter","tem","sobre","muito","mais",
]);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/** Levenshtein-based similarity for typo tolerance. */
function similar(a: string, b: string): number {
  if (a === b) return 1;
  if (Math.abs(a.length - b.length) > 3) return 0;
  const m = a.length;
  const n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

export type FaqMatch = { entry: FaqEntry; score: number };

export function searchFaq(query: string, limit = 3): FaqMatch[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const scored = FAQ_ENTRIES.map((entry) => {
    const haystack = tokenize(`${entry.question} ${entry.category}`);
    const keywords = entry.keywords.map(normalize);
    let score = 0;

    for (const token of tokens) {
      let best = 0;
      for (const kw of keywords) {
        if (kw.includes(token) || token.includes(kw)) best = Math.max(best, 1.2);
        else best = Math.max(best, similar(token, kw) >= 0.8 ? 1 : 0);
      }
      for (const word of haystack) {
        if (word === token) best = Math.max(best, 1);
        else if (word.startsWith(token) || token.startsWith(word)) best = Math.max(best, 0.7);
        else if (similar(token, word) >= 0.82) best = Math.max(best, 0.6);
      }
      score += best;
    }

    return { entry, score: score / tokens.length };
  });

  return scored
    .filter((s) => s.score > 0.34)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export const CONFIDENCE_THRESHOLD = 0.55;
