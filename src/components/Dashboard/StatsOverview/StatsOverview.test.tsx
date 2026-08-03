import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { StatsOverview } from './index'
import type { AnalyticsDashboard } from '@/lib/api'

const ANALYTICS: AnalyticsDashboard = {
  totalInteractions: 1200,
  totalMatched: 900,
  totalUnmatched: 300,
  matchRate: 0.75,
  topQuestions: [],
  unanswered: [
    { question: 'a', count: 1, lastAskedAt: '2026-01-01T00:00:00Z' },
    { question: 'b', count: 2, lastAskedAt: '2026-01-02T00:00:00Z' },
  ],
  byCategory: [],
  timeline: [],
}

describe('StatsOverview', () => {
  it('renders formatted totals from the analytics payload', () => {
    render(
      <StatsOverview analytics={ANALYTICS} days={14} resolutionRate={75} />,
    )

    expect(screen.getByText('1.200')).toBeInTheDocument()
    expect(screen.getByText('75%')).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('Últimos 14 dias')).toBeInTheDocument()
    expect(screen.getByText('900 respondidas pela base')).toBeInTheDocument()
  })

  it('falls back to zero values when analytics is null', () => {
    render(<StatsOverview analytics={null} days={7} resolutionRate={0} />)

    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    expect(screen.getByText('Últimos 7 dias')).toBeInTheDocument()
  })
})
