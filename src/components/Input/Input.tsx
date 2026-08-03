import { useId } from 'react'
import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'

type BaseProps = {
  label: string
  error?: string | null
  icon?: ReactNode
}

type InputAsInput = BaseProps & {
  multiline?: false
} & Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps>

type InputAsTextarea = BaseProps & {
  multiline: true
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps>

export type InputProps = InputAsInput | InputAsTextarea

export function Input(props: InputProps) {
  const { label, error, icon, id, className, multiline, ...rest } = props
  const generatedId = useId()
  const inputId = id ?? generatedId
  const invalid = Boolean(error)
  const errorId = `${inputId}-error`

  const fieldClasses = [
    'w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground',
    multiline ? 'resize-y' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-background px-3 focus-within:border-ring ${
          invalid ? 'border-destructive' : 'border-border'
        }`}
      >
        {icon}
        {multiline ? (
          <textarea
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={inputId}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            className={fieldClasses}
          />
        ) : (
          <input
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            id={inputId}
            aria-invalid={invalid}
            aria-describedby={invalid ? errorId : undefined}
            className={fieldClasses}
          />
        )}
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
