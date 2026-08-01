import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { KeyRound, Lock, Mail } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ApiError, login } from "@/lib/api";
import { setSession } from "@/lib/auth-store";

type LoginSearch = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Acesso administrativo — Atlas FAQ" },
      {
        name: "description",
        content:
          "Área restrita do Atlas FAQ: entre com seu e-mail e senha para ver o dashboard analítico e gerenciar a base de perguntas.",
      },
      { property: "og:title", content: "Acesso administrativo — Atlas FAQ" },
      {
        property: "og:description",
        content: "Entre na área restrita para acompanhar métricas e cadastrar perguntas do FAQ.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { token } = await login(email, password);
      setSession(token, email);
      const target = search.redirect;
      if (target && target.startsWith("/") && !target.startsWith("/login")) {
        await navigate({ to: target, replace: true });
      } else {
        await navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col justify-center py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Lock className="size-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Área administrativa
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O chatbot é público. O dashboard analítico e o cadastro de perguntas exigem login.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                E-mail
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <Mail className="size-4 text-muted-foreground" aria-hidden />
                <input
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Senha
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                <KeyRound className="size-4 text-muted-foreground" aria-hidden />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading || email.length === 0 || password.length === 0}
              className="w-full rounded-xl bg-brand-gradient px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50"
            >
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
