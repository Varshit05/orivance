import Button from '../components/Button'
import aboutHeroImage from '../assets/pexels-divinetechygirl-1181358.jpg'
import { ABOUT_PARAGRAPHS } from '../content/ovCopy'

const values = [
  { title: 'Precision', description: 'Meticulous attention to detail in every solution we deliver.' },
  { title: 'Integrity', description: 'Transparent, ethical advisory grounded in trust.' },
  { title: 'Partnership', description: 'Deep collaboration aligned with your business goals.' },
  { title: 'Innovation', description: 'Modern frameworks bridging legal expertise and technology.' },
] as const

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                About OriVance
              </p>
              <h1 className="mt-4 font-display text-[2.5rem] leading-[1.1] text-ov-navy sm:text-5xl">
                Built for the modern legal landscape
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ov-slate">
                {ABOUT_PARAGRAPHS[0]}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button to="/services">Explore Services</Button>
                <Button to="/contact" variant="secondary">
                  Get in Touch
                </Button>
              </div>
            </div>
            <figure className="relative overflow-hidden rounded-lg">
              <img
                src={aboutHeroImage}
                alt=""
                className="aspect-4/3 w-full object-cover lg:aspect-auto lg:min-h-[min(440px,50vh)]"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-ov-border/60 bg-ov-muted py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                Our Values
              </p>
              <h2 className="mt-4 font-display text-3xl text-ov-navy sm:text-4xl">
                What Guides Us
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="grid gap-0 sm:grid-cols-2">
                {values.map((v, i) => (
                  <div
                    key={v.title}
                    className={`border-t border-ov-border/50 py-6 ${i % 2 === 1 ? 'sm:pl-10 sm:border-l' : 'sm:pr-10'}`}
                  >
                    <p className="text-xs text-ov-slate/50">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-2 font-display text-xl text-ov-navy">
                      {v.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ov-slate">
                      {v.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
            Our Story
          </p>
          <h2 className="mt-4 text-center font-display text-3xl text-ov-navy">
            The OriVance Approach
          </h2>
          <div className="mt-10 space-y-6">
            {ABOUT_PARAGRAPHS.slice(1).map((paragraph, i) => (
              <p
                key={i}
                className="text-[0.9375rem] leading-[1.85] text-ov-slate"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
