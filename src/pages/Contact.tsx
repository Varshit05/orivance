// import { useState, type ChangeEvent, type FormEvent } from 'react'
// import Button from '../components/Button'
import { CONTACT_PAGE_INTRO } from '../content/ovCopy'

export default function Contact() {
  // const [form, setForm] = useState<ContactForm>(initial)
  // const [submitted, setSubmitted] = useState(false)

  // function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  //   const { name, value } = e.target
  //   setForm((f) => ({ ...f, [name]: value }))
  // }

  // function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   setSubmitted(true)
  // }

  // const inputCls =
  //   'mt-2 w-full rounded-lg border border-ov-border bg-ov-muted/50 px-3 py-3 text-sm text-ov-navy transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-ov-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-blue/12'

  // const [form, setForm] = useState<ContactForm>(initial)
  // const [submitted, setSubmitted] = useState(false)

  // function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  //   const { name, value } = e.target
  //   setForm((f) => ({ ...f, [name]: value }))
  // }

  // function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault()
  //   setSubmitted(true)
  // }

  // const inputCls =
  //   'mt-2 w-full rounded-lg border border-ov-border bg-ov-muted/50 px-3 py-3 text-sm text-ov-navy transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-ov-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-ov-blue/12'

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
              Get in Touch
            </p>
            <h1 className="mt-4 font-display text-[2.5rem] leading-[1.1] text-ov-navy sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ov-slate">
              {CONTACT_PAGE_INTRO}
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" aria-hidden>
        <div className="h-px bg-ov-border/60" />
      </div>

      {/* Form + details */}
      <section className="bg-ov-muted pt-6 pb-16 sm:pt-8 sm:pb-20">
        <div className="mx-auto grid max-w-6xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:gap-20 lg:px-8">
          {/* <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-ov-border/90 bg-white shadow-ov-lg ring-1 ring-ov-navy/4">
              <div
                className="h-1 bg-linear-to-r from-ov-blue via-ov-blue-light to-ov-accent"
                aria-hidden
              />
              <div className="p-8 sm:p-10 lg:p-11">
                {submitted ? (
                  <div className="py-2">
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
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ov-blue">
                      Write to us
                    </p>
                    <p className="mt-3 font-display text-2xl text-ov-navy sm:text-[1.75rem]">
                      Send us a message
                    </p>
                    <p className="mt-2 text-sm text-ov-slate">
                      We typically respond within 24 hours.
                    </p>
                    <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
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
            </div>
          </div> */}

          <div className="flex justify-center lg:col-span-12">
            <div className="w-full max-w-lg text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ov-blue">
                Contact Details
              </p>
              <p className="mt-5 font-display text-xl text-ov-navy">
                OriVance Global Consulting Pvt. Ltd.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ov-slate">
                Our work is grounded in a commitment to precision, integrity,
                and long-term partnership with our clients.
              </p>

              <div className="mt-6 space-y-8">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ov-slate/50">
                    Email
                  </p>
                  <a
                    href="mailto:support@orivancegc.com"
                    className="mt-1.5 inline-block text-sm text-ov-navy transition-colors duration-200 hover:text-ov-blue"
                  >
                    support@orivancegc.com
                  </a>
                </div>
                {/* <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ov-slate/50">
                    Phone
                  </p>
                  <a
                    href="tel:+917219504950"
                    className="mt-1.5 inline-block text-sm text-ov-navy transition-colors duration-200 hover:text-ov-blue"
                  >
                    +91 7219504950
                  </a>
                </div> */}
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ov-slate/50">
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
