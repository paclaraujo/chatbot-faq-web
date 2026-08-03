import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './index'

describe('Button', () => {
  it('renders a native button by default', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Salvar</Button>)

    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toHaveAttribute('type', 'button')

    await user.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('renders an anchor when href is provided', () => {
    render(<Button href="#duvidas">Saiba mais</Button>)

    const link = screen.getByRole('link', { name: 'Saiba mais' })
    expect(link).toHaveAttribute('href', '#duvidas')
  })

  it('respects an explicit type prop, e.g. submit', () => {
    render(<Button type="submit">Entrar</Button>)
    expect(screen.getByRole('button', { name: 'Entrar' })).toHaveAttribute(
      'type',
      'submit',
    )
  })

  it('disables the button and blocks clicks when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button onClick={onClick} disabled>
        Salvar
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Salvar' })
    expect(button).toBeDisabled()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('applies variant, size and pill classes', () => {
    render(
      <Button variant="destructive" size="sm" pill>
        Remover
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Remover' })
    expect(button).toHaveClass('bg-destructive', 'rounded-full', 'px-3')
  })

  it('merges a custom className with the base classes', () => {
    render(<Button className="flex-1">Cadastrar</Button>)
    expect(screen.getByRole('button', { name: 'Cadastrar' })).toHaveClass(
      'flex-1',
      'rounded-xl',
    )
  })
})
