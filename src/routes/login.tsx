import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { KeyRound, Lock, Mail } from 'lucide-react'

import { AppShell } from '@/components/AppShell'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ApiError, login } from '@/lib/api'
import { setSession } from '@/lib/authStore'

type LoginSearch = { redirect?: string }

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { token } = await login(email, password)
      setSession(token, email)
      const target = search.redirect
      if (target && target.startsWith('/') && !target.startsWith('/login')) {
        await navigate({ to: target, replace: true })
      } else {
        await navigate({ to: '/dashboard', replace: true })
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col justify-center py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Lock className="size-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Área administrativa
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            O chatbot é público. O dashboard analítico e o cadastro de perguntas
            exigem login.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <Input
              label="E-mail"
              icon={
                <Mail className="size-4 text-muted-foreground" aria-hidden />
              }
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
            />

            <Input
              label="Senha"
              icon={
                <KeyRound
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
              }
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              error={error}
            />

            <Button
              type="submit"
              disabled={loading || email.length === 0 || password.length === 0}
              fullWidth
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    </AppShell>
  )
}
