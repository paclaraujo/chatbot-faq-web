const TOKEN_KEY = 'faqbot.auth.token.v1'
const EMAIL_KEY = 'faqbot.auth.email.v1'

const isBrowser = () => typeof window !== 'undefined'

export function getToken(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export function getAuthEmail(): string | null {
  if (!isBrowser()) return null
  return window.localStorage.getItem(EMAIL_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}

export function setSession(token: string, email: string): void {
  if (!isBrowser()) return
  window.localStorage.setItem(TOKEN_KEY, token)
  window.localStorage.setItem(EMAIL_KEY, email)
  window.dispatchEvent(new CustomEvent('faqbot:auth-changed'))
}

export function clearSession(): void {
  if (!isBrowser()) return
  window.localStorage.removeItem(TOKEN_KEY)
  window.localStorage.removeItem(EMAIL_KEY)
  window.dispatchEvent(new CustomEvent('faqbot:auth-changed'))
}

export function subscribeToAuth(callback: () => void): () => void {
  if (!isBrowser()) return () => {}
  const handler = () => callback()
  window.addEventListener('faqbot:auth-changed', handler)
  window.addEventListener('storage', handler)
  return () => {
    window.removeEventListener('faqbot:auth-changed', handler)
    window.removeEventListener('storage', handler)
  }
}
