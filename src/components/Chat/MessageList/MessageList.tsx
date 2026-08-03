import { Bot, HelpCircle, Sparkle, User } from 'lucide-react'
import type { RefObject } from 'react'

import { RichText } from '@/components/RichText'
import type { ChatMessage } from '@/lib/chatStore'

export function MessageList({
  messages,
  typing,
  quickPrompts,
  onQuickPrompt,
  bottomRef,
}: {
  messages: ChatMessage[]
  typing: boolean
  quickPrompts: string[]
  onQuickPrompt: (prompt: string) => void
  bottomRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
      {messages.length === 0 && (
        <div className="mx-auto max-w-md pt-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground">
            <Bot className="size-6" aria-hidden />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Como posso ajudar hoje?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Pergunte em linguagem natural — busco a resposta mais próxima na
            base de FAQ.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => onQuickPrompt(prompt)}
                className="rounded-xl border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-secondary"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) =>
        message.role === 'user' ? (
          <div key={message.id} className="flex justify-end gap-3">
            <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              {message.content}
            </div>
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <User className="size-4" aria-hidden />
            </span>
          </div>
        ) : (
          <div key={message.id} className="flex gap-3">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
              <Bot className="size-4" aria-hidden />
            </span>
            <div className="max-w-[80%]">
              <div className="text-sm leading-relaxed text-foreground">
                <RichText text={message.content} />
              </div>
              {message.resolved === false && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs text-destructive">
                  <HelpCircle className="size-3.5" aria-hidden />
                  Pergunta sem resposta cadastrada
                </span>
              )}
              {message.category && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs text-accent-foreground">
                  <Sparkle className="size-3.5" aria-hidden />
                  {message.category}
                </span>
              )}
            </div>
          </div>
        ),
      )}

      {typing && (
        <div className="flex gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
            <Bot className="size-4" aria-hidden />
          </span>
          <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
