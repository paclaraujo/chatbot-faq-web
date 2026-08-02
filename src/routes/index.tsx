import { createFileRoute } from "@tanstack/react-router";

import { BenefitsBar } from "@/components/Home/BenefitsBar";
import { FaqCta } from "@/components/Home/FaqCta";
import { HeroSection } from "@/components/Home/HeroSection";
import { ProductGrid } from "@/components/Home/ProductGrid";
import { Footer } from "@/components/Home/Footer";
import { Header } from "@/components/Home/Header";

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
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ProductGrid />
        <BenefitsBar />
        <FaqCta />
      </main>
      <Footer />
    </div>
  );
}
