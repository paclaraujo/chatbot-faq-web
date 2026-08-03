import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Skeleton } from './index'

describe('Skeleton', () => {
  it('renders a pulsing placeholder block hidden from assistive tech', () => {
    const { container } = render(<Skeleton className="h-4 w-20" />)
    const block = container.firstChild as HTMLElement

    expect(block).toHaveAttribute('aria-hidden', 'true')
    expect(block).toHaveClass('animate-pulse', 'h-4', 'w-20')
  })
})
