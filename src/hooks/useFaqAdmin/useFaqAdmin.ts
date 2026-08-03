import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { useAuthGuard } from '@/hooks/useAuthGuard'
import { ApiError, createFaq, deleteFaq, listFaqs, updateFaq } from '@/lib/api'
import type { Faq } from '@/lib/api'
import { getToken } from '@/lib/authStore'

export type FaqFormState = {
  question: string
  answer: string
  category: string
}

const EMPTY_FORM: FaqFormState = { question: '', answer: '', category: '' }

export function useFaqAdmin() {
  const handleAuthError = useAuthGuard('/faq')
  const [entries, setEntries] = useState<Faq[]>([])
  const [form, setForm] = useState<FaqFormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [filter, setFilter] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const refresh = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      setEntries(await listFaqs(token))
    } catch (err) {
      if (handleAuthError(err)) return
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível carregar as perguntas.',
      )
    } finally {
      setLoading(false)
    }
  }, [handleAuthError])

  useEffect(() => {
    refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    const term = filter.trim().toLowerCase()
    if (!term) return entries
    return entries.filter(
      (e) =>
        e.question.toLowerCase().includes(term) ||
        e.answer.toLowerCase().includes(term) ||
        e.category.toLowerCase().includes(term),
    )
  }, [entries, filter])

  const categories = useMemo(
    () => Array.from(new Set(entries.map((e) => e.category))).sort(),
    [entries],
  )

  function resetForm() {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const token = getToken()
    if (!token) return

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim(),
    }
    if (!payload.question || !payload.answer || !payload.category) return

    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await updateFaq(token, editingId, payload)
        setFeedback('Pergunta atualizada.')
      } else {
        await createFaq(token, payload)
        setFeedback('Pergunta cadastrada na base.')
      }
      resetForm()
      await refresh()
    } catch (err) {
      if (handleAuthError(err)) return
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível salvar a pergunta.',
      )
    } finally {
      setSaving(false)
    }
  }

  function startEdit(entry: Faq) {
    setEditingId(entry.id)
    setForm({
      question: entry.question,
      answer: entry.answer,
      category: entry.category,
    })
    setFeedback(null)
  }

  async function remove(entry: Faq) {
    const token = getToken()
    if (!token) return
    if (!window.confirm(`Remover a pergunta "${entry.question}"?`)) return

    setError(null)
    try {
      await deleteFaq(token, entry.id)
      if (editingId === entry.id) resetForm()
      setFeedback('Pergunta removida da base.')
      await refresh()
    } catch (err) {
      if (handleAuthError(err)) return
      setError(
        err instanceof ApiError
          ? err.message
          : 'Não foi possível remover a pergunta.',
      )
    }
  }

  return {
    entries,
    filtered,
    categories,
    form,
    setForm,
    editingId,
    filter,
    setFilter,
    feedback,
    error,
    loading,
    saving,
    onSubmit,
    startEdit,
    remove,
    resetForm,
  }
}
