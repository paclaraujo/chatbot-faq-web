import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 py-10">
      <div className="mx-auto grid w-full max-w-350 gap-8 px-4 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
              <Sparkles className="size-4" aria-hidden />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-foreground">
              INVISÍVEL
            </span>
          </span>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Invisível Tech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
