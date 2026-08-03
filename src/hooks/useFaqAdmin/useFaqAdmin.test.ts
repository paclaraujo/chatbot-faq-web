import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useFaqAdmin } from '@/hooks/useFaqAdmin'
import { ApiError, createFaq, deleteFaq, listFaqs, updateFaq } from '@/lib/api'
import type { Faq } from '@/lib/api'
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
    listFaqs: vi.fn(),
    createFaq: vi.fn(),
    updateFaq: vi.fn(),
    deleteFaq: vi.fn(),
  }
})

const FAQS: Faq[] = [
  {
    id: 1,
    question: 'Como troco um produto?',
    answer: 'Envie um e-mail.',
    category: 'conta',
    createdAt: '2026-01-01',
  },
  {
    id: 2,
    question: 'Funciona no escuro?',
    answer: 'Sim.',
    category: 'produto',
    createdAt: '2026-01-02',
  },
]

function submitEvent() {
  return {
    preventDefault: vi.fn(),
  } as unknown as React.FormEvent<HTMLFormElement>
}

describe('useFaqAdmin', () => {
  beforeEach(() => {
    navigateMock.mockClear()
    vi.mocked(listFaqs).mockReset().mockResolvedValue(FAQS)
    vi.mocked(createFaq).mockReset()
    vi.mocked(updateFaq).mockReset()
    vi.mocked(deleteFaq).mockReset()
    setSession('tok', 'admin@example.com')
  })

  it('loads entries on mount when a token is present', async () => {
    const { result } = renderHook(() => useFaqAdmin())

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(listFaqs).toHaveBeenCalledWith('tok')
    expect(result.current.entries).toEqual(FAQS)
    expect(result.current.categories).toEqual(['conta', 'produto'])
  })

  it('filters entries by question, answer or category', async () => {
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.setFilter('escuro'))
    expect(result.current.filtered).toEqual([FAQS[1]])

    act(() => result.current.setFilter('conta'))
    expect(result.current.filtered).toEqual([FAQS[0]])

    act(() => result.current.setFilter(''))
    expect(result.current.filtered).toEqual(FAQS)
  })

  it('submits a new entry, resets the form and refreshes the list', async () => {
    vi.mocked(createFaq).mockResolvedValue(FAQS[0])
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setForm({
        question: ' q ',
        answer: ' a ',
        category: ' c ',
      })
    })

    await act(async () => {
      await result.current.onSubmit(submitEvent())
    })

    expect(createFaq).toHaveBeenCalledWith('tok', {
      question: 'q',
      answer: 'a',
      category: 'c',
    })
    expect(result.current.form).toEqual({
      question: '',
      answer: '',
      category: '',
    })
    expect(result.current.editingId).toBeNull()
    expect(result.current.feedback).toBe('Pergunta cadastrada na base.')
  })

  it('does not submit when required fields are blank', async () => {
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    await act(async () => {
      await result.current.onSubmit(submitEvent())
    })

    expect(createFaq).not.toHaveBeenCalled()
  })

  it('openCreate resets the form and opens it', async () => {
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.startEdit(FAQS[0]))
    act(() => result.current.openCreate())

    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.editingId).toBeNull()
    expect(result.current.form).toEqual({
      question: '',
      answer: '',
      category: '',
    })
  })

  it('startEdit populates the form, opens it and onSubmit updates the existing entry', async () => {
    vi.mocked(updateFaq).mockResolvedValue(FAQS[0])
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.startEdit(FAQS[0]))
    expect(result.current.editingId).toBe(1)
    expect(result.current.isFormOpen).toBe(true)
    expect(result.current.form).toEqual({
      question: FAQS[0].question,
      answer: FAQS[0].answer,
      category: FAQS[0].category,
    })

    await act(async () => {
      await result.current.onSubmit(submitEvent())
    })

    expect(updateFaq).toHaveBeenCalledWith('tok', 1, {
      question: FAQS[0].question,
      answer: FAQS[0].answer,
      category: FAQS[0].category,
    })
    expect(result.current.feedback).toBe('Pergunta atualizada.')
  })

  it('requestDelete stages an entry and confirmDelete removes it', async () => {
    vi.mocked(deleteFaq).mockResolvedValue(undefined)
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.requestDelete(FAQS[0]))
    expect(result.current.pendingDelete).toEqual(FAQS[0])
    expect(deleteFaq).not.toHaveBeenCalled()

    await act(async () => {
      await result.current.confirmDelete()
    })

    expect(deleteFaq).toHaveBeenCalledWith('tok', 1)
    expect(result.current.feedback).toBe('Pergunta removida da base.')
    expect(result.current.pendingDelete).toBeNull()
  })

  it('cancelDelete clears the staged entry without deleting it', async () => {
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => result.current.requestDelete(FAQS[0]))
    act(() => result.current.cancelDelete())

    expect(result.current.pendingDelete).toBeNull()
    expect(deleteFaq).not.toHaveBeenCalled()
  })

  it('redirects to /login on a 401 during submit and does not surface an error', async () => {
    vi.mocked(createFaq).mockRejectedValue(new ApiError('unauthorized', 401))
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setForm({ question: 'q', answer: 'a', category: 'c' })
    })
    await act(async () => {
      await result.current.onSubmit(submitEvent())
    })

    expect(navigateMock).toHaveBeenCalledWith({
      to: '/login',
      search: { redirect: '/faq' },
    })
    expect(result.current.error).toBeNull()
  })

  it('surfaces a friendly error message for non-auth failures', async () => {
    vi.mocked(createFaq).mockRejectedValue(
      new ApiError('Categoria inválida', 400),
    )
    const { result } = renderHook(() => useFaqAdmin())
    await waitFor(() => expect(result.current.loading).toBe(false))

    act(() => {
      result.current.setForm({ question: 'q', answer: 'a', category: 'c' })
    })
    await act(async () => {
      await result.current.onSubmit(submitEvent())
    })

    expect(result.current.error).toBe('Categoria inválida')
  })
})
