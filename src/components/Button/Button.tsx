import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-gradient text-primary-foreground shadow-soft hover:opacity-90',
  secondary: 'border border-border bg-card text-foreground hover:bg-secondary',
  ghost: 'border border-border text-muted-foreground hover:text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  pill = false,
  fullWidth = false,
  className = '',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  pill?: boolean
  fullWidth?: boolean
  className?: string
} = {}) {
  return [
    'inline-flex items-center justify-center gap-2 font-semibold transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
    pill ? 'rounded-full' : 'rounded-xl',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
}

type ButtonOwnProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  pill?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

type ButtonAsButton = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & {
    href?: undefined
  }

type ButtonAsAnchor = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & {
    href: string
  }

export function Button(props: ButtonAsButton | ButtonAsAnchor) {
  const { variant, size, pill, fullWidth, className, ...rest } = props
  const classes = buttonClasses({ variant, size, pill, fullWidth, className })

  if (rest.href !== undefined) {
    return <a className={classes} {...rest} />
  }

  return <button type="button" className={classes} {...rest} />
}
