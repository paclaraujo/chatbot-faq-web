import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RichText } from './index'

describe('RichText', () => {
  it('renders plain text as a single paragraph', () => {
    render(<RichText text="Olá mundo" />)

    expect(screen.getByText('Olá mundo').closest('p')).not.toBeNull()
  })

  it('renders **bold** segments as <strong>', () => {
    render(<RichText text="Isto é **importante** aqui" />)

    const strong = screen.getByText('importante')
    expect(strong.tagName).toBe('STRONG')
  })

  it('renders `code` segments as <code>', () => {
    render(<RichText text="Use o comando `npm test`" />)

    const code = screen.getByText('npm test')
    expect(code.tagName).toBe('CODE')
  })

  it('renders each line as its own paragraph', () => {
    const { container } = render(<RichText text={'linha 1\nlinha 2'} />)

    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0]).toHaveTextContent('linha 1')
    expect(paragraphs[1]).toHaveTextContent('linha 2')
  })
})
