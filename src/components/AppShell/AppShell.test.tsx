import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppShell } from './index'
import { clearSession, setSession } from '@/lib/authStore'

const navigateMock = vi.fn()
const routerState = vi.hoisted(() => ({ pathname: '/dashboard' }))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string
    children: React.ReactNode
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useNavigate: () => navigateMock,
  useRouterState: (opts: {
    select: (s: { location: { pathname: string } }) => unknown
  }) => opts.select({ location: { pathname: routerState.pathname } }),
}))

describe('AppShell', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    routerState.pathname = '/dashboard'
  })

  afterEach(() => {
    clearSession()
  })

  it('hides the nav and account controls when logged out', () => {
    render(
      <AppShell>
        <p>conteúdo</p>
      </AppShell>,
    )

    expect(
      screen.queryByRole('link', { name: /Dashboard/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /Sair/ }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('shows the nav and account email once logged in', () => {
    setSession('tok', 'admin@example.com')
    render(
      <AppShell>
        <p>conteúdo</p>
      </AppShell>,
    )

    expect(screen.getByRole('link', { name: /Dashboard/ })).toHaveAttribute(
      'href',
      '/dashboard',
    )
    expect(screen.getByRole('link', { name: /FAQ/ })).toHaveAttribute(
      'href',
      '/faq',
    )
    expect(screen.getAllByText('admin@example.com').length).toBeGreaterThan(0)
  })

  it('hides the nav on chat routes even when logged in', () => {
    routerState.pathname = '/chat/123'
    setSession('tok', 'admin@example.com')
    render(
      <AppShell>
        <p>conteúdo</p>
      </AppShell>,
    )

    expect(
      screen.queryByRole('link', { name: /Dashboard/ }),
    ).not.toBeInTheDocument()
  })

  it('signs out and navigates home when Sair is clicked', async () => {
    const user = userEvent.setup()
    setSession('tok', 'admin@example.com')
    render(
      <AppShell>
        <p>conteúdo</p>
      </AppShell>,
    )

    await user.click(screen.getAllByRole('button', { name: /Sair/ })[0])

    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
    expect(
      screen.queryByRole('link', { name: /Dashboard/ }),
    ).not.toBeInTheDocument()
  })

  it('toggles the mobile menu open and closed', async () => {
    const user = userEvent.setup()
    setSession('tok', 'admin@example.com')
    render(
      <AppShell>
        <p>conteúdo</p>
      </AppShell>,
    )

    const toggle = screen.getByRole('button', { name: 'Abrir menu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })
})
