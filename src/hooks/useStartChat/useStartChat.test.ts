import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStartChat } from '@/hooks/useStartChat'
import { getThreads } from '@/lib/chatStore'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

describe('useStartChat', () => {
  beforeEach(() => {
    navigateMock.mockClear()
  })

  it('openChat reuses the active thread and navigates to it', () => {
    const { result } = renderHook(() => useStartChat())

    result.current.openChat()

    const [thread] = getThreads()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/chat/$threadId',
      params: { threadId: thread.id },
    })
  })

  it('askQuestion creates a fresh thread and navigates with the question as search', () => {
    const { result } = renderHook(() => useStartChat())

    result.current.askQuestion('Funciona no escuro?')

    const [thread] = getThreads()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/chat/$threadId',
      params: { threadId: thread.id },
      search: { q: 'Funciona no escuro?' },
    })
  })

  it('askQuestion always starts a new thread, even with an existing one', () => {
    const { result } = renderHook(() => useStartChat())
    result.current.openChat()
    expect(getThreads()).toHaveLength(1)

    result.current.askQuestion('Outra pergunta')
    expect(getThreads()).toHaveLength(2)
  })
})
