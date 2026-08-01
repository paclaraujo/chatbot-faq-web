import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BarChart3, ListChecks, LogOut, MessagesSquare } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { clearSession, getAuthEmail, subscribeToAuth } from "@/lib/auth-store";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isChat = pathname.startsWith("/chat");
  const isDashboard = pathname.startsWith("/dashboard");
  const isFaq = pathname.startsWith("/faq");

  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const refresh = () => setEmail(getAuthEmail());
    refresh();
    return subscribeToAuth(refresh);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-350 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
              <MessagesSquare className="size-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight text-foreground">
                Invisível
              </span>
              <span className="block text-xs text-muted-foreground">
                Tecnologia que esconde
              </span>
            </span>
          </Link>

          {email && !isChat && <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isDashboard
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BarChart3 className="size-4" aria-hidden />
                Dashboard
              </Link>
              <Link
                to="/faq"
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isFaq
                    ? "bg-card text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ListChecks className="size-4" aria-hidden />
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">{email}</span>
              <button
                type="button"
                onClick={() => {
                  clearSession();
                  navigate({ to: "/" });
                }}
                className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-3.5" aria-hidden />
                Sair
              </button>
            </div>
          </div>}

        </div>
      </header>
      <main className="mx-auto w-full max-w-350 flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
