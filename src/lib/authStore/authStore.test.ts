import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearSession,
  getAuthEmail,
  getToken,
  isAuthenticated,
  setSession,
  subscribeToAuth,
} from '@/lib/authStore'

describe('authStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('has no session by default', () => {
    expect(getToken()).toBeNull()
    expect(getAuthEmail()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('persists token and email on setSession', () => {
    setSession('tok-123', 'user@example.com')

    expect(getToken()).toBe('tok-123')
    expect(getAuthEmail()).toBe('user@example.com')
    expect(isAuthenticated()).toBe(true)
  })

  it('removes the session on clearSession', () => {
    setSession('tok-123', 'user@example.com')
    clearSession()

    expect(getToken()).toBeNull()
    expect(getAuthEmail()).toBeNull()
    expect(isAuthenticated()).toBe(false)
  })

  it('notifies subscribers when the session changes', () => {
    const callback = vi.fn()
    const unsubscribe = subscribeToAuth(callback)

    setSession('tok-123', 'user@example.com')
    expect(callback).toHaveBeenCalledTimes(1)

    clearSession()
    expect(callback).toHaveBeenCalledTimes(2)

    unsubscribe()
    setSession('tok-456', 'other@example.com')
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('reacts to storage events fired from other tabs', () => {
    const callback = vi.fn()
    const unsubscribe = subscribeToAuth(callback)

    window.dispatchEvent(new Event('storage'))
    expect(callback).toHaveBeenCalledTimes(1)

    unsubscribe()
  })
})
