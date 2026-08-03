export function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
      {message}
    </p>
  )
}
