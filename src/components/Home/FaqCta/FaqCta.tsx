import { ChevronRight, MessageCircleQuestion } from 'lucide-react'

import { Button } from '@/components/Button'
import { useStartChat } from '@/hooks/useStartChat'

const SAMPLE_QUESTIONS = [
  'Por que ainda consigo me ver?',
  'Funciona em espelhos?',
  'Meu gato consegue me enxergar?',
  'A invisibilidade funciona no escuro?',
]

export function FaqCta() {
  const { openChat, askQuestion } = useStartChat()

  return (
    <section id="duvidas" className="bg-background py-16 sm:py-20">
      <div className="mx-auto w-full max-w-350 px-4 sm:px-6">
        <div className="grid gap-8 rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div className="flex items-start gap-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Ficou com dúvidas?
              </h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Pergunte ao nosso assistente e encontre respostas para as
                dúvidas mais comuns sobre a Capa de Invisibilidade.
              </p>
              <Button onClick={openChat} pill className="mt-4">
                Ver FAQ
                <ChevronRight className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-2 lg:w-96">
            {SAMPLE_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => askQuestion(question)}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm text-foreground shadow-soft transition-colors hover:border-primary hover:bg-secondary cursor-pointer"
              >
                <MessageCircleQuestion
                  className="size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="line-clamp-2">{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
