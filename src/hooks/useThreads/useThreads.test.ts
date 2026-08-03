import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useThreads } from '@/hooks/useThreads'
import { createThread } from '@/lib/chatStore'

describe('useThreads', () => {
  it('hydrates with the current threads and marks itself hydrated', () => {
    createThread()
    const { result } = renderHook(() => useThreads())

    expect(result.current.hydrated).toBe(true)
    expect(result.current.threads).toHaveLength(1)
  })

  it('stays in sync when the store changes', () => {
    const { result } = renderHook(() => useThreads())
    expect(result.current.threads).toHaveLength(0)

    act(() => {
      createThread()
    })

    expect(result.current.threads).toHaveLength(1)
  })
})
