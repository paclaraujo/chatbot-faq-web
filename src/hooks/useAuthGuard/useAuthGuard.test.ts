import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthGuard } from '@/hooks/useAuthGuard'
import { ApiError } from '@/lib/api'
import { setSession, getToken } from '@/lib/authStore'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

describe('useAuthGuard', () => {
  beforeEach(() => {
    navigateMock.mockClear()
  })

  it('clears the session and redirects on a 401 ApiError', () => {
    setSession('tok', 'user@example.com')
    const { result } = renderHook(() => useAuthGuard('/dashboard'))

    const handled = result.current(new ApiError('unauthorized', 401))

    expect(handled).toBe(true)
    expect(getToken()).toBeNull()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      search: { redirect: '/dashboard' },
    })
  })

  it('ignores non-401 errors', () => {
    const { result } = renderHook(() => useAuthGuard('/faq'))

    expect(result.current(new ApiError('server error', 500))).toBe(false)
    expect(result.current(new Error('boom'))).toBe(false)
    expect(navigateMock).not.toHaveBeenCalled()
  })
})
