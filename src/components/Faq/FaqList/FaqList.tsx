import { Pencil, Search, Trash2 } from 'lucide-react'

import { Skeleton } from '@/components/Skeleton'
import type { Faq } from '@/lib/api'

export function FaqList({
  entries,
  filtered,
  filter,
  onFilterChange,
  loading,
  onEdit,
  onDelete,
}: {
  entries: Faq[]
  filtered: Faq[]
  filter: string
  onFilterChange: (value: string) => void
  loading: boolean
  onEdit: (entry: Faq) => void
  onDelete: (entry: Faq) => void
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Perguntas cadastradas ({entries.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Alterações valem imediatamente para o chatbot público.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
          <Search className="size-4 text-muted-foreground" aria-hidden />
          <input
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder="Filtrar…"
            className="w-40 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {loading ? (
        <ul className="divide-y divide-border" aria-label="Carregando…">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <div className="flex shrink-0 gap-1">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </li>
          ))}
        </ul>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nenhuma pergunta encontrada.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {entry.question}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {entry.answer}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                    {entry.category}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => onEdit(entry)}
                  aria-label={`Editar ${entry.question}`}
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  aria-label={`Excluir ${entry.question}`}
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
