import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, MessagesSquare } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isDashboard = pathname.startsWith("/dashboard");

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
                Atlas FAQ
              </span>
              <span className="block text-xs text-muted-foreground">
                Atendimento automatizado
              </span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isDashboard
                  ? "text-muted-foreground hover:text-foreground"
                  : "bg-card text-foreground shadow-soft"
              }`}
            >
              <MessagesSquare className="size-4" aria-hidden />
              Chatbot
            </Link>
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
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
