# Invisível — Chatbot FAQ

Aplicação web da **Capa de Invisibilidade™**: uma landing page de produto com um assistente de chat que responde perguntas frequentes (FAQ) dos clientes, e um painel administrativo protegido por login para gerenciar as perguntas/respostas e acompanhar métricas de uso do chatbot.

O front-end consome uma API externa (não incluída neste repositório) para autenticação, chat e analytics.

## Sumário

- [Stack](#stack)
- [Requisitos](#requisitos)
- [Configuração](#configuração)
- [Como rodar](#como-rodar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas da aplicação](#rotas-da-aplicação)
- [Testes e cobertura](#testes-e-cobertura)
- [CI](#ci)
- [Deploy](#deploy)

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router) (roteamento por arquivos, geração automática do route tree)
- [Vite](https://vitejs.dev/) como bundler/dev server
- [Tailwind CSS 4](https://tailwindcss.com/) para estilização
- [Recharts](https://recharts.org/) para os gráficos do dashboard administrativo
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) para testes
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) para lint e formatação

## Requisitos

- Node.js **22.x** (versão usada no CI — veja `.github/workflows/test-coverage.yml`)
- npm (o projeto usa `package-lock.json`)
- Uma instância da API do backend (chat, login, FAQ e analytics), acessível via HTTP

## Configuração

1. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Preencha `VITE_API_BASE_URL` com a URL base da API que fornece os endpoints `/chat`, `/auth/login`, `/faq` e `/analytics`:

   ```env
   VITE_API_BASE_URL=http://localhost:3001
   ```

   Se a variável não for definida, o app usa `http://localhost:3001` como padrão (veja `src/lib/api/api.ts`).

## Como rodar

Instale as dependências e suba o servidor de desenvolvimento:

```bash
npm install
npm run dev
```

A aplicação sobe em `http://localhost:3000`.

### Build de produção

```bash
npm run build
npm run preview
```

## Scripts disponíveis

| Script                    | Descrição                                                      |
| ------------------------- | -------------------------------------------------------------- |
| `npm run dev`             | Inicia o servidor de desenvolvimento (Vite) na porta 3000      |
| `npm run build`           | Gera o build de produção em `dist/`                            |
| `npm run preview`         | Serve o build de produção localmente                           |
| `npm run generate-routes` | Gera manualmente o `routeTree.gen.ts` a partir de `src/routes` |
| `npm run lint`            | Roda o ESLint                                                  |
| `npm run format`          | Formata o código com Prettier e corrige lint automaticamente   |
| `npm run check`           | Verifica formatação sem alterar arquivos                       |
| `npm run test`            | Roda a suíte de testes (Vitest) uma vez                        |
| `npm run test:watch`      | Roda os testes em modo watch                                   |
| `npm run coverage`        | Roda os testes com relatório de cobertura                      |

## Estrutura do projeto

```
src/
├── components/           # Componentes de UI, organizados por área
│   ├── AppShell/          # Layout base (header/estrutura comum)
│   ├── Chat/              # Composer, lista de mensagens e sidebar de threads do chat
│   ├── Dashboard/         # Cards, gráficos e tabelas do painel de analytics
│   ├── ErrorBanner/       # Banner de erro reutilizável
│   ├── Faq/               # Formulário e listagem de FAQs (admin)
│   ├── Home/              # Seções da landing page (Header, Hero, ProductGrid, etc.)
│   └── RichText/          # Renderização de texto formatado
├── hooks/                 # Hooks customizados (um hook por pasta, com seu teste)
│   ├── useAnalytics/       # Busca dados de analytics para o dashboard
│   ├── useAuthEmail/       # Expõe o e-mail do usuário autenticado
│   ├── useAuthGuard/       # Guarda de autenticação para páginas protegidas
│   ├── useFaqAdmin/        # CRUD de FAQs no painel admin
│   ├── useStartChat/       # Inicia uma nova conversa de chat
│   └── useThreads/         # Gerencia as threads de conversa
├── lib/                   # Camada de dados e integrações
│   ├── api/                # Cliente HTTP e chamadas para a API (chat, auth, faq, analytics)
│   ├── authStore/          # Sessão do usuário (token/e-mail) via localStorage
│   └── chatStore/          # Estado/persistência das conversas do chat
├── routes/                # Rotas (file-based routing do TanStack Router)
│   ├── __root.tsx           # Layout raiz
│   ├── index.tsx             # Landing page ("/")
│   ├── login.tsx              # Login ("/login")
│   ├── chat.$threadId.tsx      # Chat de uma thread ("/chat/:threadId")
│   └── _admin.tsx + _admin/    # Área administrativa protegida (dashboard, faq)
├── test/                  # Setup global dos testes
├── router.tsx             # Instância do TanStack Router
├── routeTree.gen.ts       # Árvore de rotas gerada automaticamente (não editar)
├── main.tsx               # Ponto de entrada da aplicação
└── styles.css              # Estilos globais/Tailwind
```

Cada componente e hook segue o padrão de pasta própria com `NomeDoItem.tsx`, `NomeDoItem.test.tsx` e um `index.ts` reexportando o módulo.

## Rotas da aplicação

- `/` — Landing page do produto (Header, Hero, grid de produtos, benefícios, CTA para o FAQ e footer).
- `/login` — Login do painel administrativo (usa `email`/`senha`, redireciona de volta para a rota original após autenticar).
- `/chat/:threadId` — Tela de chat onde o usuário conversa com o assistente de FAQ.
- `/dashboard` e `/faq` (sob `_admin`) — Área administrativa protegida: dashboard de analytics (métricas, gráficos, perguntas sem resposta) e gerenciamento de FAQs (criar, editar, excluir). O acesso é protegido por `beforeLoad` em `src/routes/_admin.tsx`, que redireciona para `/login` caso não haja sessão autenticada.

## Testes e cobertura

O projeto usa Vitest com ambiente `jsdom` e Testing Library. Praticamente todo componente, hook e módulo de `lib/` tem um arquivo `*.test.tsx`/`*.test.ts` correspondente.

```bash
npm run test        # roda tudo uma vez
npm run test:watch  # modo watch
npm run coverage     # gera relatório de cobertura (thresholds em vitest.config.ts)
```

O relatório de cobertura em HTML fica disponível em `coverage/index.html` após rodar `npm run coverage`.

## CI

O workflow `.github/workflows/test-coverage.yml` roda em pull requests para `main`, usando Node 22, e falha caso a cobertura de testes fique abaixo do mínimo configurado (80%).

## Deploy

O projeto está configurado para deploy na [Vercel](https://vercel.com/) (`vercel.json`), com build via `npm run build`, saída em `dist/` e rewrites de SPA para suportar as rotas do TanStack Router.
