import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { FaqForm } from './index'
import type { FaqFormState } from '@/hooks/useFaqAdmin'

const EMPTY_FORM: FaqFormState = { question: '', answer: '', category: '' }
const VALID_FORM: FaqFormState = {
  question: 'Como faço para trocar um produto?',
  answer: 'Envie um e-mail para o suporte.',
  category: 'conta',
}

function setup(overrides: Partial<React.ComponentProps<typeof FaqForm>> = {}) {
  const onChange = vi.fn()
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) =>
    event.preventDefault(),
  )
  const onCancel = vi.fn()
  render(
    <FaqForm
      open
      form={EMPTY_FORM}
      onChange={onChange}
      categories={['conta', 'pagamento']}
      editing={false}
      saving={false}
      feedback={null}
      onSubmit={onSubmit}
      onCancel={onCancel}
      {...overrides}
    />,
  )
  return { onChange, onSubmit, onCancel }
}

describe('FaqForm', () => {
  it('renders nothing when closed', () => {
    setup({ open: false })
    expect(
      screen.queryByPlaceholderText('Como faço para trocar um produto?'),
    ).not.toBeInTheDocument()
  })

  it('shows the create heading and submit label when not editing', () => {
    setup({ editing: false })

    expect(
      screen.getByRole('heading', { name: 'Nova pergunta' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Cadastrar pergunta/ }),
    ).toBeInTheDocument()
  })

  it('shows the edit heading, save label and cancel button when editing', async () => {
    const user = userEvent.setup()
    const { onCancel } = setup({ editing: true, form: VALID_FORM })

    expect(
      screen.getByRole('heading', { name: 'Editar pergunta' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Salvar alterações/ }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Cancelar/ }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onChange with the updated field values', async () => {
    const user = userEvent.setup()
    const { onChange } = setup()

    await user.type(
      screen.getByPlaceholderText('Como faço para trocar um produto?'),
      'O',
    )

    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FORM, question: 'O' })
  })

  it('calls onChange when editing the answer and category fields', async () => {
    const user = userEvent.setup()
    const { onChange } = setup()

    await user.type(
      screen.getByPlaceholderText(
        'Use **negrito** para destacar trechos importantes.',
      ),
      'R',
    )
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FORM, answer: 'R' })

    await user.type(screen.getByPlaceholderText('conta'), 'c')
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FORM, category: 'c' })
  })

  it('disables the submit button while saving', () => {
    setup({ saving: true, form: VALID_FORM })
    expect(
      screen.getByRole('button', { name: /Cadastrar pergunta/ }),
    ).toBeDisabled()
  })

  it('disables the submit button when the form is invalid', () => {
    setup({ form: EMPTY_FORM })
    expect(
      screen.getByRole('button', { name: /Cadastrar pergunta/ }),
    ).toBeDisabled()
  })

  it('enables the submit button once every field has at least 5 characters', () => {
    setup({ form: VALID_FORM })
    expect(
      screen.getByRole('button', { name: /Cadastrar pergunta/ }),
    ).toBeEnabled()
  })

  it('shows a validation error below a field once it has been touched', async () => {
    const user = userEvent.setup()
    setup({ form: { ...EMPTY_FORM, question: 'oi' } })

    const input = screen.getByPlaceholderText(
      'Como faço para trocar um produto?',
    )
    await user.click(input)
    await user.tab()

    expect(
      screen.getByText('Deve ter pelo menos 5 caracteres.'),
    ).toBeInTheDocument()
  })

  it('keeps the submit button disabled and does not call onSubmit for an invalid form', async () => {
    const user = userEvent.setup()
    const { onSubmit } = setup({ form: EMPTY_FORM })

    const submitButton = screen.getByRole('button', {
      name: /Cadastrar pergunta/,
    })
    expect(submitButton).toBeDisabled()

    await user.click(submitButton)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits the form when valid', async () => {
    const user = userEvent.setup()
    const { onSubmit } = setup({ form: VALID_FORM })

    await user.click(screen.getByRole('button', { name: /Cadastrar pergunta/ }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('shows the feedback message when provided', () => {
    setup({ feedback: 'Pergunta salva com sucesso' })
    expect(screen.getByText('Pergunta salva com sucesso')).toBeInTheDocument()
  })

  it('lists the available categories as datalist options', () => {
    setup({ categories: ['conta', 'pagamento'] })
    const input = screen.getByPlaceholderText('conta')
    expect(input.getAttribute('list')).toBe('faq-categories')
    expect(document.querySelectorAll('#faq-categories option')).toHaveLength(2)
  })
})
