import { Link } from 'react-router-dom'
import serviceRegulatoryImage from '../assets/services-1.jpg'

export default function RegulatoryResilience() {
  const corePillars = [
    {
      title: 'Corporate & Statutory Governance',
      description:
        'Establish a rock-solid operational foundation. We manage entity maintenance, board secretarial services, statutory filings, and register compliance, ensuring your company remains in perfect standing with regulatory bodies.',
    },
    {
      title: 'Operational Risk & Advisory',
      description:
        'Identify and mitigate bottlenecks before they disrupt operations. We perform thorough threat assessments, map compliance requirements to daily processes, and design risk-mitigation protocols tailored to your industry.',
    },
    {
      title: 'Custom Policy & Playbook Design',
      description:
        'Transform static policies into dynamic assets. We craft bespoke compliance manuals, operational codes of conduct, whistleblower policies, and anti-bribery frameworks that are practical and easy to enforce.',
    },
    {
      title: 'Audit Readiness & Investor Due Diligence',
      description:
        'Prepare your organization for scrutiny. We organize your legal data room, audit existing filings, and build internal controls so that you are always ready for institutional audits, vendor assessments, or investor due diligence.',
    },
  ] as const

  const steps = [
    {
      number: '01',
      title: 'Diagnostic Review & Gap Assessment',
      description:
        'We review your corporate entity structures, filing history, and existing policies to pinpoint immediate vulnerabilities and areas of non-compliance.',
    },
    {
      number: '02',
      title: 'Tailored Framework Architecture',
      description:
        'Rather than generic templates, we draft custom compliance calendars, reporting hierarchies, and governance manuals that fit your unique operating model.',
    },
    {
      number: '03',
      title: 'Seamless Operational Integration',
      description:
        'We work side-by-side with your teams to set up automatic tracking tools, integrate guidelines into daily workflows, and establish accountability.',
    },
    {
      number: '04',
      title: 'Proactive Monitoring & Advisory',
      description:
        'Compliance is an ongoing journey. We provide continuous support, periodic health-checks, and flag new regulatory updates that affect your business.',
    },
  ] as const

  return (
    <>
      {/* Back link bar */}
      <div className="bg-white border-b border-ov-border/60 py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-ov-slate transition-colors duration-200 hover:text-ov-navy"
          >
            <span aria-hidden className="text-base">←</span> Back to Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ov-blue">
                Service Details · Area 01
              </span>
              <h1 className="mt-4 font-display text-[2.5rem] leading-[1.08] text-ov-navy sm:text-5xl lg:text-6xl">
                Regulatory Resilience Shield
              </h1>
              <p className="mt-6 text-[1.0625rem] leading-relaxed text-ov-slate max-w-2xl">
                Stay fully compliant without the administrative burden. We handle your corporate &
                regulatory compliance, design robust internal governance frameworks, and provide
                proactive operational risk advisory so your business stays protected, audit-ready,
                and focused on sustainable growth.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-xl shadow-ov-md ring-1 ring-ov-border/25">
                <img
                  src={serviceRegulatoryImage}
                  alt="Regulatory Resilience Shield"
                  className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-ov-navy/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlight/Overview Callout */}
      <section className="border-t border-b border-ov-border/60 bg-ov-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl text-ov-navy sm:text-3xl leading-snug">
              "We believe compliance is not a checkbox exercise, but a strategic asset. By embedding
              clarity into your governance structures, we protect your enterprise value and build
              unshakeable investor trust."
            </h2>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-ov-blue">
              — The OriVance Core Philosophy
            </p>
          </div>
        </div>
      </section>

      {/* Core Service Pillars Grid */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-ov-navy sm:text-4xl">
              Key Focus Areas
            </h2>
            <p className="mt-4 text-base text-ov-slate">
              Our comprehensive approach addresses the entire spectrum of regulatory risk and statutory requirements
              for modern organizations.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:gap-10">
            {corePillars.map((pillar, i) => (
              <div
                key={i}
                className="group relative flex flex-col rounded-xl border border-ov-border/60 bg-white p-6 shadow-ov-sm transition-all duration-300 hover:-translate-y-1 hover:border-ov-blue/40 hover:shadow-ov-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ov-muted text-sm font-bold text-ov-blue transition-colors duration-300 group-hover:bg-ov-blue group-hover:text-white">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="mt-5 font-display text-xl text-ov-navy transition-colors duration-200 group-hover:text-ov-blue">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ov-slate flex-1">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / Methodology Section */}
      <section className="border-t border-ov-border/60 bg-ov-muted/50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-ov-blue">
              Our Methodology
            </span>
            <h2 className="mt-3 font-display text-3xl text-ov-navy sm:text-4xl">
              How We Build Your Shield
            </h2>
            <p className="mt-4 text-sm text-ov-slate">
              A structured, transparent, and collaborative process designed to minimize business disruption
              while achieving absolute compliance maturity.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col bg-white p-6 rounded-lg border border-ov-border/50 shadow-xs">
                <span className="font-mono text-3xl font-bold text-ov-blue/20">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-lg font-medium text-ov-navy leading-snug">
                  {step.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ov-slate">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl text-ov-navy sm:text-4xl">
                Designed for Growth-Minded Enterprises
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-ov-slate">
                Traditional consulting firms often deliver theoretical advice that slows down business. At OriVance,
                our Regulatory Resilience Shield is built to align governance with speed, allowing you to move fast
                without breaking structures.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  '100% transparent pricing with no-surprise retainer or project scopes.',
                  'Sector-specific expertise including Technology, SaaS, GCCs, and manufacturing.',
                  'Direct advisory support from seasoned compliance professionals.',
                  'Fully digital-first approach for automated tracking and paperless governance.'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-ov-slate">
                    <span className="mt-1 text-ov-blue text-sm select-none" aria-hidden>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-ov-border/80 bg-ov-muted/20 p-8 lg:p-12">
              <h3 className="font-display text-2xl text-ov-navy">
                Who Is This Shield For?
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-ov-slate">
                Our services are highly beneficial for companies in several stages:
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-ov-navy">Early & Mid-Stage Scaleups</h4>
                  <p className="mt-1 text-xs text-ov-slate">
                    Seeking to structure their entity files, draft solid internal codes, and establish
                    due diligence readiness for Series A/B funding rounds.
                  </p>
                </div>
                <div className="border-t border-ov-border/60 pt-4">
                  <h4 className="text-sm font-semibold text-ov-navy">Global Capability Centres (GCCs)</h4>
                  <p className="mt-1 text-xs text-ov-slate">
                    Requiring compliant setting up, local operational board structures, and multi-jurisdiction risk advisory.
                  </p>
                </div>
                <div className="border-t border-ov-border/60 pt-4">
                  <h4 className="text-sm font-semibold text-ov-navy">E-Commerce & Digital Platforms</h4>
                  <p className="mt-1 text-xs text-ov-slate">
                    Navigating dynamic consumer compliance, data handling requirements, and vendor contracts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
