import { Headset, Lock, ShieldCheck, Truck } from "lucide-react";

const BENEFITS = [
  { icon: Truck, title: "Frete Grátis", subtitle: "Para todo o Brasil" },
  { icon: ShieldCheck, title: "Garantia Total", subtitle: "30 dias de garantia" },
  { icon: Lock, title: "Pagamento Seguro", subtitle: "Seus dados protegidos" },
  { icon: Headset, title: "Suporte 24/7", subtitle: "Estamos sempre aqui" },
];

export function BenefitsBar() {
  return (
    <section className="border-b border-border bg-secondary/40 py-8">
      <div className="mx-auto grid w-full max-w-350 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {BENEFITS.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-soft">
              <Icon className="size-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
