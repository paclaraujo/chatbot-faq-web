import { Crown, ImageOff } from "lucide-react";

type Product = {
  name: string;
  subtitle: string;
  price: string;
  colors: string[];
  badge?: string;
};

const PRODUCTS: Product[] = [
  {
    name: "Clássica",
    subtitle: "Perfeita para o dia a dia",
    price: "R$ 299,90",
    colors: ["#f5f5f4", "#18181b", "#1d4ed8"],
  },
  {
    name: "Stealth Premium",
    subtitle: "Tecnologia de ponta",
    price: "R$ 499,90",
    colors: ["#18181b", "#71717a", "#15803d"],
  },
  {
    name: "Edição Limitada",
    subtitle: "Para colecionadores",
    price: "R$ 699,90",
    colors: ["#ca8a04", "#18181b", "#b91c1c"],
    badge: "Edição Limitada",
  },
  {
    name: "Invis Kids",
    subtitle: "Pequenos invisíveis",
    price: "R$ 249,90",
    colors: ["#f9a8d4", "#7dd3fc", "#6ee7b7"],
  },
];

export function ProductGrid() {
  return (
    <section id="produtos" className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Escolha sua
          </span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Capa de Invisibilidade
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-border" />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-soft"
            >
              <div className="flex aspect-square items-start justify-end rounded-xl border-2 border-dashed border-border text-muted-foreground/50 relative w-full flex-col gap-3 bg-[repeating-conic-gradient(var(--secondary)_0%_25%,transparent_0%_50%)] bg-[length:24px_24px] p-3 text-center shadow-soft">
                <span className="bg-brand-gradient py-0.5 px-2 text-xs font-semibold text-primary-foreground shadow-soft rounded-full">Esgotado</span>
              </div>

              <h3 className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                {product.name}
                {product.badge && (
                  <Crown className="size-3.5 text-primary" aria-hidden />
                )}
              </h3>
              <p className="text-xs text-muted-foreground">{product.subtitle}</p>

              <div className="mt-3 flex items-center gap-1.5">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="size-4 rounded-full border border-border hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all cursor-pointer"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="mt-3 text-lg font-bold text-primary">{product.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
