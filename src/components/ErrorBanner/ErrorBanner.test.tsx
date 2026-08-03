import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorBanner } from './index'

describe('ErrorBanner', () => {
  it('renders the provided message', () => {
    render(<ErrorBanner message="Algo deu errado" />)

    expect(screen.getByText('Algo deu errado')).toBeInTheDocument()
  })
})
