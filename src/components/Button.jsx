import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium tracking-wide transition-all duration-250 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]'

const variants = {
  primary:
    'bg-ov-navy text-white shadow-ov-sm hover:-translate-y-px hover:bg-ov-navy-light hover:shadow-ov-md focus-visible:outline-ov-navy',
  secondary:
    'border border-ov-border bg-white text-ov-navy shadow-ov-sm hover:-translate-y-px hover:border-ov-blue/30 hover:text-ov-blue hover:shadow-ov-md focus-visible:outline-ov-blue',
  ghost:
    'text-ov-blue hover:text-ov-navy focus-visible:outline-ov-blue px-4 py-2',
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  type = 'button',
  className = '',
  ...props
}) {
  const cls = `${base} ${variants[variant] ?? variants.primary} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={cls} {...props}>
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
