import { Plus, Trash2 } from 'lucide-react'

import type { Thread } from '@/lib/chatStore'

export function ThreadSidebar({
  threads,
  activeThreadId,
  onCreate,
  onSelect,
  onDelete,
}: {
  threads: Thread[]
  activeThreadId: string
  onCreate: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <aside className="hidden rounded-2xl border border-border bg-card p-3 shadow-soft lg:block">
      <button
        type="button"
        onClick={onCreate}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient px-3 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" aria-hidden />
        Nova conversa
      </button>

      <p className="mt-5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Histórico
      </p>
      <ul className="mt-2 space-y-1">
        {threads.map((item) => (
          <li
            key={item.id}
            className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 transition-colors ${
              item.id === activeThreadId ? 'bg-accent' : 'hover:bg-secondary'
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="block truncate text-sm text-foreground">
                {item.title}
              </span>
              <span className="block text-xs text-muted-foreground">
                {item.messages.filter((m) => m.role === 'user').length}{' '}
                perguntas
              </span>
            </button>
            <button
              type="button"
              aria-label={`Excluir conversa ${item.title}`}
              onClick={() => onDelete(item.id)}
              className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-card hover:text-destructive group-hover:opacity-100"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
