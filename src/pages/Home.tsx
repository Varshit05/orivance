import { Link } from 'react-router-dom'
import Button from '../components/Button'
import heroImage from '../assets/pexels-chetanvlad-1838032.jpg'
import {
  MISSION_STATEMENT,
  MISSION_TAGLINE,
  SERVICES,
  INDUSTRIES,
  INDUSTRIES_INTRO,
  INDUSTRIES_HEADING,
} from '../content/ovCopy'

const serviceBriefs = [
  'Corporate compliance, governance frameworks, and operational risk advisory.',
  'Entity management, legal enablement, and operational risk control.',
  'End-to-end CLM, e-discovery, and legal intake with modern tech.',
  'Knowledge ecosystems, policy libraries, playbooks, and AI-ready databases.',
  'Process re-engineering, legal tech integration, and performance dashboards.',
] as const

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative min-h-[min(92vh,860px)] overflow-hidden bg-ov-navy bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-ov-navy/95 via-ov-navy/80 to-ov-navy/50"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ov-navy/70 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex min-h-[min(92vh,860px)] max-w-6xl flex-col justify-center px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <p className="opacity-0-animate animate-fade-in-up text-sm font-semibold uppercase tracking-[0.3em] text-white/50 sm:text-base lg:text-lg">
            OriVance Global Consulting
          </p>
          <h1 className="opacity-0-animate animate-fade-in-up animation-delay-100 mt-6 max-w-3xl font-display text-[2.75rem] leading-[1.1] text-white sm:text-[3.5rem] lg:text-[4rem]">
            Transform Legal Complexity into Strategic Business Advantage
          </h1>
          <p className="opacity-0-animate animate-fade-in-up animation-delay-200 mt-8 max-w-lg text-base leading-relaxed text-slate-300">
            We partner with businesses to simplify complex legal and regulatory
            landscapes, with clarity, resilience, and confidence.
          </p>
          <div className="opacity-0-animate animate-fade-in-up animation-delay-300 mt-10 flex flex-wrap gap-4">
            <Button
              to="/contact"
              className="bg-white! text-ov-navy! hover:bg-slate-100!"
            >
              Book a Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-linear-to-b from-white via-ov-muted/40 to-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-ov-border/80 bg-white shadow-ov-lg ring-1 ring-ov-navy/4">
            <div
              className="pointer-events-none absolute top-0 bottom-0 left-0 w-1 bg-linear-to-b from-ov-blue via-ov-blue-light to-ov-accent sm:w-1.5"
              aria-hidden
            />
            <div className="grid gap-0 lg:grid-cols-12">
              <div className="border-b border-ov-border/50 bg-ov-muted/25 px-8 py-10 sm:px-10 sm:py-12 lg:col-span-4 lg:border-b-0 lg:border-r lg:border-ov-border/50 lg:py-14">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                  Our Mission
                </p>
                <p className="mt-4 max-w-56 text-sm leading-relaxed text-ov-slate">
                  {MISSION_TAGLINE}
                </p>
              </div>
              <div className="px-8 py-10 sm:px-10 sm:py-12 lg:col-span-8 lg:flex lg:items-center lg:py-14 lg:pr-12">
                <blockquote className="relative w-full">
                  <span
                    className="font-display pointer-events-none absolute -top-2 left-0 text-[3.5rem] leading-none text-ov-blue/[0.14] select-none sm:text-[4.25rem] lg:text-[4.75rem]"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="relative z-10 pt-6 pl-1 font-display text-xl leading-[1.55] text-ov-navy sm:pt-7 sm:text-2xl sm:leading-normal lg:pt-8 lg:text-[1.75rem] lg:leading-normal">
                    {MISSION_STATEMENT}
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden>
        <div className="h-px bg-ov-border/60" />
      </div>

      {/* Services — overview */}
      <section id="services" className="scroll-mt-24 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                Services
              </p>
              <h2 className="mt-4 font-display text-3xl text-ov-navy sm:text-4xl">
                What We Offer
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ov-slate">
                We deliver structured legal and regulatory solutions across five
                core practice areas, each designed to move your business
                forward with clarity and confidence.
              </p>
              <div className="mt-8">
                <Button to="/services">
                  View all services
                </Button>
              </div>
            </div>
            <div className="lg:col-span-8">
              <ul>
                {SERVICES.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      to={`/services#${s.id}`}
                      className="group flex gap-6 border-t border-ov-border/50 py-6 transition-all duration-250 ease-out hover:-translate-y-px hover:border-ov-blue/40 last:border-b"
                    >
                      <span className="mt-0.5 text-xs font-medium text-ov-slate/40 transition-colors duration-200 group-hover:text-ov-blue">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-ov-navy transition-colors duration-200 group-hover:text-ov-blue">
                          {s.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-ov-slate">
                          {serviceBriefs[i]}
                        </p>
                      </div>
                      <span
                        className="mt-1 text-ov-slate/30 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ov-blue"
                        aria-hidden
                      >
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="border-t border-ov-border/60 bg-ov-muted py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                {INDUSTRIES_HEADING}
              </p>
              <h2 className="mt-4 font-display text-3xl text-ov-navy sm:text-4xl">
                Sectors We Serve
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ov-slate">
                {INDUSTRIES_INTRO}
              </p>
            </div>
            <div className="lg:col-span-7 lg:pt-2">
              <ul className="grid gap-0 sm:grid-cols-2">
                {INDUSTRIES.map((name, i) => (
                  <li
                    key={name}
                    className="border-b border-ov-border/50 py-5 text-[0.9375rem] font-medium text-ov-navy sm:odd:pr-8 sm:even:pl-8 sm:even:border-l"
                  >
                    <span className="mr-3 text-xs text-ov-slate/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
