import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import type { FaqFormState } from '@/hooks/useFaqAdmin'

const MIN_LENGTH = 5

type FaqField = keyof FaqFormState

function validateField(value: unknown): string | null {
  if (typeof value !== 'string') return 'Este campo deve ser um texto.'
  if (value.trim().length < MIN_LENGTH) {
    return `Deve ter pelo menos ${MIN_LENGTH} caracteres.`
  }
  return null
}

export function FaqForm({
  open,
  form,
  onChange,
  categories,
  editing,
  saving,
  feedback,
  onSubmit,
  onCancel,
}: {
  open: boolean
  form: FaqFormState
  onChange: (form: FaqFormState) => void
  categories: string[]
  editing: boolean
  saving: boolean
  feedback: string | null
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  const [touched, setTouched] = useState<Record<FaqField, boolean>>({
    question: false,
    answer: false,
    category: false,
  })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors: Record<FaqField, string | null> = {
    question: validateField(form.question),
    answer: validateField(form.answer),
    category: validateField(form.category),
  }
  const isValid = !errors.question && !errors.answer && !errors.category

  function errorFor(field: FaqField) {
    return touched[field] || submitAttempted ? errors[field] : null
  }

  function handleBlur(field: FaqField) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) {
      setSubmitAttempted(true)
      setTouched({ question: true, answer: true, category: true })
      return
    }
    onSubmit(event)
  }

  function handleClose() {
    setTouched({ question: false, answer: false, category: false })
    setSubmitAttempted(false)
    onCancel()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editing ? 'Editar pergunta' : 'Nova pergunta'}
    >
      <p className="mb-4 text-xs text-muted-foreground">
        Alterações valem imediatamente para o chatbot público.
      </p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <Field label="Pergunta" error={errorFor('question')}>
          <input
            value={form.question}
            onChange={(e) => onChange({ ...form, question: e.target.value })}
            onBlur={() => handleBlur('question')}
            placeholder="Como faço para trocar um produto?"
            aria-invalid={Boolean(errorFor('question'))}
            className={inputClass(Boolean(errorFor('question')))}
          />
        </Field>

        <Field label="Resposta" error={errorFor('answer')}>
          <textarea
            value={form.answer}
            onChange={(e) => onChange({ ...form, answer: e.target.value })}
            onBlur={() => handleBlur('answer')}
            rows={5}
            placeholder="Use **negrito** para destacar trechos importantes."
            aria-invalid={Boolean(errorFor('answer'))}
            className={inputClass(Boolean(errorFor('answer')), true)}
          />
        </Field>

        <Field label="Categoria" error={errorFor('category')}>
          <input
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            onBlur={() => handleBlur('category')}
            placeholder="conta"
            list="faq-categories"
            aria-invalid={Boolean(errorFor('category'))}
            className={inputClass(Boolean(errorFor('category')))}
          />
          <datalist id="faq-categories">
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field>

        <div className="flex gap-2 pt-1">
          <Button
            type="submit"
            disabled={saving || !isValid}
            className="flex-1"
          >
            <Plus className="size-4" aria-hidden />
            {editing ? 'Salvar alterações' : 'Cadastrar pergunta'}
          </Button>
          <Button type="button" variant="ghost" onClick={handleClose}>
            <X className="size-4" aria-hidden />
            Cancelar
          </Button>
        </div>
        {feedback && (
          <p className="text-xs text-muted-foreground">{feedback}</p>
        )}
      </form>
    </Modal>
  )
}

function inputClass(invalid: boolean, textarea = false) {
  return `w-full ${textarea ? 'resize-y' : ''} rounded-xl border ${
    invalid ? 'border-destructive' : 'border-border'
  } bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring`
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error: string | null
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5">
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
      {error && <span className="block text-xs text-destructive">{error}</span>}
    </label>
  )
}
