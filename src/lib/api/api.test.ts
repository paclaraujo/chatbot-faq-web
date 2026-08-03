import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  ApiError,
  askQuestion,
  createFaq,
  deleteFaq,
  getAnalytics,
  listFaqs,
  login,
  updateFaq,
} from '@/lib/api'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

function jsonResponse(body: unknown, init: { status?: number } = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('askQuestion posts the question and returns the parsed body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        matched: true,
        answer: '42',
        faq: { id: 1, question: 'q', category: 'c' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await askQuestion('Qual a resposta?')

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/chat`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ question: 'Qual a resposta?' }),
      }),
    )
    expect(result).toEqual({
      matched: true,
      answer: '42',
      faq: { id: 1, question: 'q', category: 'c' },
    })
  })

  it('login sends credentials and returns the token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ token: 'abc123' }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await login('a@b.com', 'secret')

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/auth/login`,
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'a@b.com', password: 'secret' }),
      }),
    )
    expect(result).toEqual({ token: 'abc123' })
  })

  it('listFaqs sends the bearer token and no body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
    vi.stubGlobal('fetch', fetchMock)

    await listFaqs('tok')

    const [, options] = fetchMock.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer tok')
    expect(options.body).toBeUndefined()
  })

  it('createFaq, updateFaq and deleteFaq hit the expected endpoints', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ id: 1 }))
      .mockResolvedValueOnce(jsonResponse({ id: 1 }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await createFaq('tok', { question: 'q', answer: 'a', category: 'c' })
    await updateFaq('tok', 1, { answer: 'novo' })
    const deleteResult = await deleteFaq('tok', 1)

    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/faq`)
    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
    expect(fetchMock.mock.calls[1][0]).toBe(`${BASE_URL}/faq/1`)
    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
    expect(fetchMock.mock.calls[2][0]).toBe(`${BASE_URL}/faq/1`)
    expect(fetchMock.mock.calls[2][1].method).toBe('DELETE')
    expect(deleteResult).toBeUndefined()
  })

  it('getAnalytics builds the query string only from provided params', async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        jsonResponse({
          totalInteractions: 0,
          totalMatched: 0,
          totalUnmatched: 0,
          matchRate: 0,
          topQuestions: [],
          unanswered: [],
          byCategory: [],
          timeline: [],
        }),
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    await getAnalytics('tok', { topLimit: 5 })
    expect(fetchMock.mock.calls[0][0]).toBe(`${BASE_URL}/analytics?topLimit=5`)

    await getAnalytics('tok')
    expect(fetchMock.mock.calls[1][0]).toBe(`${BASE_URL}/analytics`)
  })

  it('throws an ApiError with the server message when the response is not ok', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ message: 'Credenciais inválidas' }, { status: 401 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await expect(login('a@b.com', 'wrong')).rejects.toMatchObject({
      message: 'Credenciais inválidas',
      status: 401,
    })
  })

  it("falls back to a generic message when the error body isn't JSON", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('<html>oops</html>', { status: 500 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(askQuestion('oi')).rejects.toMatchObject({
      message: 'A API retornou um erro (500).',
      status: 500,
    })
  })

  it('wraps network failures in an ApiError', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('network down'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(askQuestion('oi')).rejects.toBeInstanceOf(ApiError)
  })
})
