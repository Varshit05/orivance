import { useState } from 'react'
import Button from '../components/Button'
import { EXPECTED_OUTCOME } from '../content/ovCopy'

const initial = { name: '', email: '', company: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  const inputCls =
    'mt-2 w-full border-b border-ov-border bg-transparent px-0 py-3 text-sm text-ov-navy transition-colors duration-200 placeholder:text-slate-400 focus:border-ov-navy focus:outline-none'

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ov-blue">
              Get in Touch
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] leading-[1.1] text-ov-navy sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ov-slate">
              {EXPECTED_OUTCOME}
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden>
        <div className="h-px bg-ov-border/60" />
      </div>

      {/* Form + details */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="py-12">
                <p className="font-display text-2xl text-ov-navy">
                  Thank you for reaching out.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ov-slate">
                  We have received your message and will respond within one
                  business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="font-display text-2xl text-ov-navy">
                  Send us a message
                </p>
                <p className="mt-2 text-sm text-ov-slate">
                  We typically respond within 24 hours.
                </p>
                <div className="mt-12 grid gap-8 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="name"
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ov-slate"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ov-slate"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ov-slate"
                    >
                      Company
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={form.company}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ov-slate"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      className={`${inputCls} resize-y`}
                    />
                  </div>
                </div>
                <div className="mt-10">
                  <Button type="submit">Send Message</Button>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 lg:pl-12 lg:border-l lg:border-ov-border/60">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-ov-blue">
                Contact Details
              </p>
              <p className="mt-5 font-display text-xl text-ov-navy">
                OriVance Global Consulting Pvt. Ltd.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ov-slate">
                Our work is grounded in a commitment to precision, integrity,
                and long-term partnership with our clients.
              </p>

              <div className="mt-10 space-y-8">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ov-slate/50">
                    Email
                  </p>
                  <a
                    href="mailto:hello@orivance.com"
                    className="mt-1.5 block text-sm text-ov-navy transition-colors duration-200 hover:text-ov-blue"
                  >
                    hello@orivance.com
                  </a>
                </div>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ov-slate/50">
                    Phone
                  </p>
                  <a
                    href="tel:+911800000000"
                    className="mt-1.5 block text-sm text-ov-navy transition-colors duration-200 hover:text-ov-blue"
                  >
                    +91 1800 000 0000
                  </a>
                </div>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ov-slate/50">
                    Business Hours
                  </p>
                  <p className="mt-1.5 text-sm text-ov-navy">
                    Monday – Friday, 9:00 a.m. – 6:00 p.m. IST
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
