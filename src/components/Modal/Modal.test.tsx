import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './index'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )

    expect(screen.queryByText('Conteúdo')).not.toBeInTheDocument()
  })

  it('renders the title and children when open', () => {
    render(
      <Modal open onClose={vi.fn()} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog', { name: 'Título' })).toBeInTheDocument()
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )

    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when the escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(
      <Modal open onClose={onClose} title="Título">
        <p>Conteúdo</p>
      </Modal>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
