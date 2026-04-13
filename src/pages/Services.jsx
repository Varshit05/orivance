import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SERVICES, SERVICES_PAGE_INTRO } from '../content/ovCopy'
import serviceRegulatoryImage from '../assets/services-1.jpg'
import serviceBusinessImage from '../assets/services-2.jpg'
import serviceContractImage from '../assets/services-3.jpg'
import serviceKnowledgeImage from '../assets/services-4.jpg'
import serviceLegalOpsImage from '../assets/services-5.jpg'

function ServiceBlock({ id, title, summary, imageLeft, image, index }) {
  const number = String(index + 1).padStart(2, '0')

  const text = (
    <div className="flex flex-col justify-center">
      <p className="text-xs font-medium text-ov-slate/50">{number}</p>
      <h2 className="mt-3 font-display text-[2rem] leading-[1.15] text-ov-navy sm:text-[2.25rem]">
        {title}
      </h2>
      <p className="mt-5 text-[0.9375rem] leading-[1.75] text-ov-slate">
        {summary}
      </p>
    </div>
  )

  const visual = (
    <div className="group relative overflow-hidden rounded-lg shadow-sm ring-1 ring-ov-border/25 transition-shadow duration-300 hover:shadow-lg hover:ring-ov-border/40">
      <img
        src={image}
        alt=""
        className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
        loading="lazy"
      />
    </div>
  )

  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 sm:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-ov-muted'}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {imageLeft ? (
            <>
              {visual}
              {text}
            </>
          ) : (
            <>
              {text}
              {visual}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

const images = [
  serviceRegulatoryImage,
  serviceBusinessImage,
  serviceContractImage,
  serviceKnowledgeImage,
  serviceLegalOpsImage,
]

const serviceData = SERVICES.map((s, i) => ({
  ...s,
  imageLeft: i % 2 === 0,
  image: images[i],
  index: i,
}))

export default function Services() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash || pathname !== '/services') return
    const id = hash.replace(/^#/, '')
    if (!id) return

    const scrollToTarget = () => {
      document.getElementById(id)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    scrollToTarget()
    const t = window.setTimeout(scrollToTarget, 50)
    return () => window.clearTimeout(t)
  }, [pathname, hash])

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ov-blue">
              What We Offer
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] leading-[1.1] text-ov-navy sm:text-5xl">
              Our Services
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ov-slate">
              {SERVICES_PAGE_INTRO}
            </p>
          </div>

        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden>
        <div className="h-px bg-ov-border/60" />
      </div>

      {/* Service blocks */}
      <div>
        {serviceData.map((s) => (
          <ServiceBlock key={s.id} {...s} />
        ))}
      </div>
    </>
  )
}
