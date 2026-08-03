import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Input } from './index'

describe('Input', () => {
  it('renders a label wired to the input', () => {
    render(<Input label="E-mail" value="" onChange={() => {}} />)
    const input = screen.getByLabelText('E-mail')
    expect(input.tagName).toBe('INPUT')
  })

  it('accepts typed input via onChange', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="E-mail" value="" onChange={onChange} />)

    await user.type(screen.getByLabelText('E-mail'), 'a')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows the error message below the input, marked as invalid', () => {
    render(
      <Input
        label="Senha"
        value=""
        onChange={() => {}}
        error="Credenciais inválidas."
      />,
    )

    const input = screen.getByLabelText('Senha')
    expect(input).toHaveAttribute('aria-invalid', 'true')

    const message = screen.getByText('Credenciais inválidas.')
    expect(message).toHaveClass('text-destructive')
    expect(input).toHaveAttribute('aria-describedby', message.id)
  })

  it('does not render an error message when there is no error', () => {
    const { container } = render(
      <Input label="E-mail" value="" onChange={() => {}} />,
    )
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('renders a textarea when multiline is set', () => {
    render(<Input label="Resposta" multiline value="" onChange={() => {}} />)
    expect(screen.getByLabelText('Resposta').tagName).toBe('TEXTAREA')
  })
})
