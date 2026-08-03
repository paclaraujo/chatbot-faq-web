import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ChartTooltip } from './index'

describe('ChartTooltip', () => {
  it('renders nothing when inactive', () => {
    const { container } = render(
      <ChartTooltip active={false} payload={[{ name: 'x', value: 1 }]} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there is no payload', () => {
    const { container } = render(<ChartTooltip active payload={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the label and every payload entry when active', () => {
    render(
      <ChartTooltip
        active
        label="2026-01-01"
        payload={[
          { name: 'Consultas', value: 12, color: '#123' },
          { name: 'Resolvidas', value: 9, color: '#456' },
        ]}
      />,
    )

    expect(screen.getByText('2026-01-01')).toBeInTheDocument()
    expect(screen.getByText(/Consultas:/)).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText(/Resolvidas:/)).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
  })
})
