import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProductGrid } from './index'

describe('ProductGrid', () => {
  it('renders every product with its name and price', () => {
    render(<ProductGrid />)

    expect(screen.getByText('Clássica')).toBeInTheDocument()
    expect(screen.getByText('R$ 299,90')).toBeInTheDocument()
    expect(screen.getByText('Stealth Premium')).toBeInTheDocument()
    expect(screen.getByText('R$ 499,90')).toBeInTheDocument()
    expect(screen.getByText('Edição Limitada')).toBeInTheDocument()
    expect(screen.getByText('R$ 699,90')).toBeInTheDocument()
    expect(screen.getByText('Invis Kids')).toBeInTheDocument()
    expect(screen.getByText('R$ 249,90')).toBeInTheDocument()
  })

  it('shows a sold out badge on every card', () => {
    render(<ProductGrid />)

    expect(screen.getAllByText('Esgotado')).toHaveLength(4)
  })
})
