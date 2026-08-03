import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAnalytics } from '@/hooks/useAnalytics'
import { ApiError, getAnalytics } from '@/lib/api'
import type { AnalyticsDashboard } from '@/lib/api'
import type * as ApiModule from '@/lib/api'
import { setSession } from '@/lib/authStore'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof ApiModule>('@/lib/api')
  return {
    ...actual,
    getAnalytics: vi.fn(),
  }
})

const DASHBOARD: AnalyticsDashboard = {
  totalInteractions: 120,
  totalMatched: 90,
  totalUnmatched: 30,
  matchRate: 0.75,
  topQuestions: [
    { faqId: 1, question: 'Como troco?', category: 'conta', count: 10 },
  ],
  unanswered: [
    {
      question: 'Serve para chuva?',
      count: 3,
      lastAskedAt: '2026-01-01T10:00:00Z',
    },
  ],
  byCategory: [{ category: 'conta', count: 40 }],
  timeline: [{ date: '2026-01-01', count: 12 }],
}

describe('useAnalytics', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    vi.mocked(getAnalytics).mockReset().mockResolvedValue(DASHBOARD)
    setSession('tok', 'admin@example.com')
  })

  it('fetches analytics for the default 14-day range and reshapes the view model', async () => {
    const { result } = renderHook(() => useAnalytics())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(getAnalytics).toHaveBeenCalledWith('tok', {
      timelineDays: 14,
      topLimit: 6,
      unansweredLimit: 6,
    })
    expect(result.current.data.topQuestions).toEqual([
      { name: 'Como troco?', count: 10 },
    ])
    expect(result.current.data.categories).toEqual([
      { name: 'conta', value: 40 },
    ])
    expect(result.current.data.missing).toEqual(DASHBOARD.unanswered)
    expect(result.current.resolutionRate).toBe(75)
  })

  it('refetches when the day range changes', async () => {
    const { result } = renderHook(() => useAnalytics())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.setDays(30))

    await waitFor(() =>
      expect(getAnalytics).toHaveBeenLastCalledWith('tok', {
        timelineDays: 30,
        topLimit: 6,
        unansweredLimit: 6,
      }),
    )
  })

  it('redirects to /login on a 401 without setting an error message', async () => {
    vi.mocked(getAnalytics).mockRejectedValue(new ApiError('unauthorized', 401))
    const { result } = renderHook(() => useAnalytics())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      search: { redirect: '/dashboard' },
    })
    expect(result.current.error).toBeNull()
  })

  it('surfaces a friendly error message for non-auth failures', async () => {
    vi.mocked(getAnalytics).mockRejectedValue(
      new ApiError('Falha no servidor', 500),
    )
    const { result } = renderHook(() => useAnalytics())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.error).toBe('Falha no servidor')
  })
})
