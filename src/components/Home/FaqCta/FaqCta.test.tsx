import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { FaqCta } from './index'
import { getThreads } from '@/lib/chatStore'

const navigateMock = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

describe('FaqCta', () => {
  beforeEach(() => {
    navigateMock.mockClear()
  })

  it('navigates to the active chat thread when opening the FAQ', async () => {
    const user = userEvent.setup()
    render(<FaqCta />)

    await user.click(screen.getByRole('button', { name: /Ver FAQ/ }))

    const [thread] = getThreads()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/chat/$threadId',
      params: { threadId: thread.id },
    })
  })

  it('starts a new thread with the sample question pre-filled', async () => {
    const user = userEvent.setup()
    render(<FaqCta />)

    await user.click(
      screen.getByRole('button', { name: /Funciona em espelhos\?/ }),
    )

    const [thread] = getThreads()
    expect(navigateMock).toHaveBeenCalledWith({
      to: '/chat/$threadId',
      params: { threadId: thread.id },
      search: { q: 'Funciona em espelhos?' },
    })
  })
})
