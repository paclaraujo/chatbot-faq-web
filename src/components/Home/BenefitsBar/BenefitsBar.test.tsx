import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BenefitsBar } from './index'

describe('BenefitsBar', () => {
  it('renders every benefit with its title and subtitle', () => {
    render(<BenefitsBar />)

    expect(screen.getByText('Frete Grátis')).toBeInTheDocument()
    expect(screen.getByText('Para todo o Brasil')).toBeInTheDocument()
    expect(screen.getByText('Garantia Total')).toBeInTheDocument()
    expect(screen.getByText('Pagamento Seguro')).toBeInTheDocument()
    expect(screen.getByText('Suporte 24/7')).toBeInTheDocument()
  })
})
