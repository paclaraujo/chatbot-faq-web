import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatCard } from './index'

describe('StatCard', () => {
  it('renders the icon, label, value and hint', () => {
    render(
      <StatCard
        icon={<span data-testid="icon" />}
        label="Consultas"
        value="120"
        hint="Últimos 14 dias"
      />,
    )

    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Consultas')).toBeInTheDocument()
    expect(screen.getByText('120')).toBeInTheDocument()
    expect(screen.getByText('Últimos 14 dias')).toBeInTheDocument()
  })

  it('renders a skeleton instead of the content while loading', () => {
    render(
      <StatCard
        icon={<span data-testid="icon" />}
        label="Consultas"
        value="120"
        hint="Últimos 14 dias"
        loading
      />,
    )

    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    expect(screen.queryByText('Consultas')).not.toBeInTheDocument()
    expect(screen.queryByText('120')).not.toBeInTheDocument()
  })
})
