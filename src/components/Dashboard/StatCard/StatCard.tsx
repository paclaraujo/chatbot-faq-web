import type { ReactNode } from 'react'

import { Skeleton } from '@/components/Skeleton'

export function StatCard({
  icon,
  label,
  value,
  hint,
  loading,
}: {
  icon: ReactNode
  label: string
  value: string
  hint: string
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-xl" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="mt-3 h-8 w-16" />
        <Skeleton className="mt-2 h-3 w-32" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          {icon}
        </span>
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}
