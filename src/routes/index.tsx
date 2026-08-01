import { createFileRoute } from "@tanstack/react-router";

import { BenefitsBar } from "@/components/home/benefits-bar";
import { FaqCta } from "@/components/home/faq-cta";
import { HeroSection } from "@/components/home/hero-section";
import { ProductGrid } from "@/components/home/product-grid";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Invisível — Capa de Invisibilidade™" },
      {
        name: "description",
        content:
          "Capa de Invisibilidade com tecnologia avançada. Tire suas dúvidas com o assistente de FAQ.",
      },
      { property: "og:title", content: "Invisível — Capa de Invisibilidade™" },
      {
        property: "og:description",
        content: "Desapareça com estilo. Fale com o assistente de FAQ para tirar suas dúvidas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <ProductGrid />
        <BenefitsBar />
        <FaqCta />
      </main>
      <SiteFooter />
    </div>
  );
}
