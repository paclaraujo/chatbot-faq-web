import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FaqList } from './index'
import type { Faq } from '@/lib/api'

const ENTRIES: Faq[] = [
  {
    id: 1,
    question: 'Como troco a senha?',
    answer: 'Acesse configurações.',
    category: 'conta',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    question: 'Funciona no escuro?',
    answer: 'Sim, funciona.',
    category: 'produto',
    createdAt: '2026-01-02T00:00:00Z',
  },
]

function setup(overrides: Partial<React.ComponentProps<typeof FaqList>> = {}) {
  const onFilterChange = vi.fn()
  const onEdit = vi.fn()
  const onDelete = vi.fn()
  render(
    <FaqList
      entries={ENTRIES}
      filtered={ENTRIES}
      filter=""
      onFilterChange={onFilterChange}
      loading={false}
      onEdit={onEdit}
      onDelete={onDelete}
      {...overrides}
    />,
  )
  return { onFilterChange, onEdit, onDelete }
}

describe('FaqList', () => {
  it('shows the total entry count and every filtered question', () => {
    setup()

    expect(screen.getByText('Perguntas cadastradas (2)')).toBeInTheDocument()
    expect(screen.getByText('Como troco a senha?')).toBeInTheDocument()
    expect(screen.getByText('Funciona no escuro?')).toBeInTheDocument()
  })

  it('shows a skeleton placeholder while loading', () => {
    setup({ loading: true })
    expect(screen.getByLabelText('Carregando…')).toBeInTheDocument()
    expect(screen.queryByText('Como troco a senha?')).not.toBeInTheDocument()
  })

  it('shows an empty state when the filtered list is empty', () => {
    setup({ filtered: [] })
    expect(screen.getByText('Nenhuma pergunta encontrada.')).toBeInTheDocument()
  })

  it('calls onFilterChange as the filter input changes', async () => {
    const user = userEvent.setup()
    const { onFilterChange } = setup()

    await user.type(screen.getByPlaceholderText('Filtrar…'), 's')
    expect(onFilterChange).toHaveBeenCalledWith('s')
  })

  it('calls onEdit and onDelete for the selected entry', async () => {
    const user = userEvent.setup()
    const { onEdit, onDelete } = setup()

    await user.click(
      screen.getByRole('button', { name: 'Editar Como troco a senha?' }),
    )
    expect(onEdit).toHaveBeenCalledWith(ENTRIES[0])

    await user.click(
      screen.getByRole('button', { name: 'Excluir Funciona no escuro?' }),
    )
    expect(onDelete).toHaveBeenCalledWith(ENTRIES[1])
  })
})
