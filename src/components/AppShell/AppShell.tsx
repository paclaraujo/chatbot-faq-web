import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  ListChecks,
  LogOut,
  Menu,
  MessagesSquare,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { useAuthEmail } from '@/hooks/useAuthEmail'
import { clearSession } from '@/lib/authStore'

function navLinkClass(active: boolean) {
  return `flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'bg-card text-foreground shadow-soft'
      : 'text-muted-foreground hover:text-foreground'
  }`
}

function mobileNavLinkClass(active: boolean) {
  return `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-secondary text-foreground'
      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
  }`
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const isChat = pathname.startsWith('/chat')
  const isDashboard = pathname.startsWith('/dashboard')
  const isFaq = pathname.startsWith('/faq')
  const email = useAuthEmail()
  const [menuOpen, setMenuOpen] = useState(false)
  const showNav = Boolean(email) && !isChat

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function handleSignOut() {
    clearSession()
    navigate({ to: '/' })
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-350 items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
              <MessagesSquare className="size-5" aria-hidden />
            </span>
          </Link>

          {showNav && (
            <>
              <div className="hidden items-center gap-3 md:flex">
                <nav className="flex items-center gap-1 rounded-full border border-border bg-secondary p-1">
                  <Link to="/dashboard" className={navLinkClass(isDashboard)}>
                    <BarChart3 className="size-4" aria-hidden />
                    Dashboard
                  </Link>
                  <Link to="/faq" className={navLinkClass(isFaq)}>
                    <ListChecks className="size-4" aria-hidden />
                    FAQ
                  </Link>
                </nav>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{email}</span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <LogOut className="size-3.5" aria-hidden />
                    Sair
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X className="size-5" aria-hidden />
                ) : (
                  <Menu className="size-5" aria-hidden />
                )}
              </button>
            </>
          )}
        </div>

        {showNav && menuOpen && (
          <div className="border-t border-border bg-card px-4 py-3 sm:px-6 md:hidden">
            <nav className="flex flex-col gap-1">
              <Link to="/dashboard" className={mobileNavLinkClass(isDashboard)}>
                <BarChart3 className="size-4" aria-hidden />
                Dashboard
              </Link>
              <Link to="/faq" className={mobileNavLinkClass(isFaq)}>
                <ListChecks className="size-4" aria-hidden />
                FAQ
              </Link>
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="truncate text-xs text-muted-foreground">
                {email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="size-3.5" aria-hidden />
                Sair
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-350 flex-1 px-4 py-6 sm:px-6">
        {children}
      </main>
    </div>
  )
}
