import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { ConfirmDialog } from './index'

function setup(
  overrides: Partial<React.ComponentProps<typeof ConfirmDialog>> = {},
) {
  const onConfirm = vi.fn()
  const onCancel = vi.fn()
  render(
    <ConfirmDialog
      open
      title="Remover pergunta"
      message='Remover a pergunta "Como troco a senha?"?'
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...overrides}
    />,
  )
  return { onConfirm, onCancel }
}

describe('ConfirmDialog', () => {
  it('renders nothing when closed', () => {
    setup({ open: false })
    expect(screen.queryByText(/Remover a pergunta/)).not.toBeInTheDocument()
  })

  it('renders the title and message when open', () => {
    setup()
    expect(
      screen.getByRole('dialog', { name: 'Remover pergunta' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Remover a pergunta "Como troco a senha?"?'),
    ).toBeInTheDocument()
  })

  it('uses default confirm/cancel labels', () => {
    setup()
    expect(
      screen.getByRole('button', { name: 'Confirmar' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('supports custom labels', () => {
    setup({ confirmLabel: 'Remover', cancelLabel: 'Voltar' })
    expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument()
  })

  it('calls onConfirm and onCancel', async () => {
    const user = userEvent.setup()
    const { onConfirm, onCancel } = setup()

    await user.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
