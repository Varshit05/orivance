import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import Button from './Button'
import ovLogo from '../assets/Ov.jpeg'

const linkClass = ({ isActive }) =>
  `text-[0.8125rem] font-medium transition-colors duration-200 ${
    isActive
      ? 'text-ov-navy'
      : 'text-ov-slate hover:text-ov-navy'
  }`

const mobileLinkClass = ({ isActive }) =>
  `block py-3 text-sm font-medium transition-colors duration-200 ${
    isActive
      ? 'text-ov-navy'
      : 'text-ov-slate hover:text-ov-navy'
  }`

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-ov-sm' : ''
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between border-b border-ov-border/60 py-4">
          <NavLink
            to="/"
            className="group flex items-center gap-2 sm:gap-3 transition-opacity duration-200 hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <img
              src={ovLogo}
              alt="OriVance"
              className="h-9 w-auto sm:h-11"
              decoding="async"
            />
            {/* <span className="hidden text-[0.6rem] font-medium uppercase tracking-[0.15em] text-ov-slate sm:inline">
              OriVance
            </span> */}
          </NavLink>

          <ul className="hidden items-center gap-8 md:flex">
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} className={linkClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button to="/contact" className="text-xs tracking-[0.08em]">
              Get in Touch
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] md:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`h-px w-5 bg-ov-navy transition-all duration-300 ${open ? 'translate-y-[6px] rotate-45' : ''}`}
            />
            <span
              className={`h-px w-5 bg-ov-navy transition-all duration-300 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`h-px w-5 bg-ov-navy transition-all duration-300 ${open ? '-translate-y-[6px] -rotate-45' : ''}`}
            />
          </button>
        </nav>
      </div>

      <div
        className={`bg-white md:hidden ${open ? 'max-h-80 opacity-100' : 'max-h-0 overflow-hidden opacity-0'} transition-all duration-300 ease-out`}
      >
        <div className="mx-auto max-w-6xl border-b border-ov-border/40 px-4 pb-6 sm:px-6 lg:px-8">
          <ul className="flex flex-col">
            {navItems.map(({ to, label }) => (
              <li key={to} className="border-b border-ov-border/30 last:border-b-0">
                <NavLink
                  to={to}
                  className={mobileLinkClass}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button
              to="/contact"
              className="w-full text-xs tracking-[0.08em]"
              onClick={() => setOpen(false)}
            >
              Get in Touch
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
