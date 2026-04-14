import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { Link, type LinkProps } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-250 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]'

const variants = {
  primary:
    'bg-ov-navy text-white shadow-ov-sm hover:-translate-y-px hover:bg-ov-navy-light hover:shadow-ov-md focus-visible:outline-ov-navy',
  secondary:
    'border border-ov-border bg-white text-ov-navy shadow-ov-sm hover:-translate-y-px hover:border-ov-blue/30 hover:text-ov-blue hover:shadow-ov-md focus-visible:outline-ov-blue',
  ghost:
    'text-ov-blue hover:text-ov-navy focus-visible:outline-ov-blue px-4 py-2',
} as const

type Variant = keyof typeof variants

export type ButtonProps = {
  children: ReactNode
  variant?: Variant
  to?: LinkProps['to']
  href?: string
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  className?: string
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'className' | 'children'
>

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  type = 'button',
  className = '',
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant] ?? variants.primary} ${className}`

  if (to != null) {
    return (
      <Link
        to={to}
        className={cls}
        {...(props as Omit<LinkProps, 'to' | 'className' | 'children'>)}
      >
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}
