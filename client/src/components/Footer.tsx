import { Link } from 'react-router-dom'

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Footer() {
  return (
    <footer className="border-t border-ov-border/60 bg-ov-navy">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <span className="font-display text-xl text-white">
              OriVance
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Partnering with businesses to simplify complex legal and
              regulatory landscapes, with clarity, resilience, and confidence.
            </p>
          </div>

          <div className="lg:col-span-5 lg:flex lg:justify-end">
            <ul className="flex flex-col gap-3">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-8 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} OriVance Global Consulting Pvt. Ltd.
          </p>
          <p className="text-slate-600">
            Legal · Regulatory · Operations · Governance
          </p>
        </div>
      </div>
    </footer>
  )
}
