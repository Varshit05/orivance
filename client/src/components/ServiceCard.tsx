import { Link } from 'react-router-dom'

export interface ServiceCardProps {
  title: string
  description?: string
  to?: string
  delayClass?: string
  dense?: boolean
}

export default function ServiceCard({
  title,
  description,
  to = '/services',
  delayClass = '',
  dense = false,
}: ServiceCardProps) {
  return (
    <Link to={to} className={`group block ${delayClass}`}>
      <article
        className={`relative flex h-full flex-col border-t-2 border-ov-border/50 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-ov-blue ${dense ? 'pt-5' : 'pt-8'}`}
      >
        <h3
          className={`font-display tracking-tight text-ov-navy transition-colors duration-200 group-hover:text-ov-blue ${dense ? 'text-lg leading-snug' : 'text-xl'}`}
        >
          {title}
        </h3>
        {description && (
          <p
            className={`mt-3 flex-1 text-ov-slate ${dense ? 'text-[0.8rem] leading-relaxed line-clamp-5' : 'text-sm leading-relaxed'}`}
          >
            {description}
          </p>
        )}
        <div className={dense ? 'mt-4' : 'mt-6'}>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ov-blue transition-all duration-200 group-hover:gap-3">
            Learn more
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </article>
    </Link>
  )
}
