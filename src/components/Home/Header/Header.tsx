import { Link } from '@tanstack/react-router'
import { ShieldQuestion, Sparkles } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-350 items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground">
            <Sparkles className="size-5" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-foreground">
              INVISÍVEL
            </span>
            <span className="block text-[8px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Tecnologia que esconde
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-full bg-brand-gradient px-4 py-2 text-xs md:text-sm font-medium text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            <ShieldQuestion className="size-4" aria-hidden />
            Área Logada
          </Link>
        </div>
      </div>
    </header>
  )
}
