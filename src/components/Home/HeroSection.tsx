import { ArrowDown, Eye, Feather, ShoppingBag, Sparkles, Zap } from "lucide-react";

const FEATURES = [
  { icon: Eye, label: "100% Invisível" },
  { icon: Zap, label: "Tecnologia Avançada" },
  { icon: Feather, label: "Leve e Confortável" },
];

export function HeroSection() {
  return (
    <section className="border-b border-border bg-linear-to-b from-accent/40 to-background">
      <div className="mx-auto grid w-full max-w-350 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-soft">
            <Sparkles className="size-3.5" aria-hidden />
            LANÇAMENTO EXCLUSIVO
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Capa de
            <br />
            Invisibilidade™
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Desapareça com estilo. Tecnologia avançada para total camuflagem em qualquer
            situação.
          </p>

          <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-md">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-soft">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-xs font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#produtos"
              className="flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
            >
              <ShoppingBag className="size-4" aria-hidden />
              Comprar agora
            </a>
            <a
              href="#duvidas"
              className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Saiba mais
              <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <Sparkles
            className="absolute -left-3 -top-3 size-6 text-primary/50"
            aria-hidden
          />
          <Sparkles
            className="absolute -bottom-3 -right-3 size-6 rotate-12 text-primary/50"
            aria-hidden
          />

          <div
            className="relative flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-primary/30 bg-[repeating-conic-gradient(var(--secondary)_0%_25%,transparent_0%_50%)] bg-size-[24px_24px] p-8 text-center shadow-soft"
          >
          </div>

          <div className="absolute right-0 top-1/2 flex w-56 -translate-y-1/2 translate-x-6 items-start gap-2.5 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-soft sm:translate-x-10">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-xs font-semibold leading-snug text-foreground">
              INVISÌVEL. NÃO É MÁGICA.
              <br />É TECNOLOGIA.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
