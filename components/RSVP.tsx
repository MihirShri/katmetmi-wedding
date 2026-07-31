'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FUNCTION_LIST = ['Haldi', 'Sangeet', 'Wedding'] as const

type FormState = {
  name: string
  email: string
  attending: 'yes' | 'no' | ''
  guests: string
  functions: string[]
  diet: 'veg' | 'non-veg' | ''
  message: string
}

const INITIAL: FormState = {
  name: '',
  email: '',
  attending: '',
  guests: '1',
  functions: [],
  diet: '',
  message: '',
}

export default function RSVP() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (submitted) {
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [submitted])

  const toggleFunction = (fn: string) =>
    setForm((p) => ({
      ...p,
      functions: p.functions.includes(fn)
        ? p.functions.filter((f) => f !== fn)
        : [...p.functions, fn],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    if (!form.attending) {
      setError("Please let us know if you're coming.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError("Our internet had feelings. Your RSVP didn't go through — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'w-full bg-card border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/50 transition-colors'
  const labelCls = 'block font-sans text-[10px] tracking-[0.2em] uppercase text-muted mb-1.5'

  return (
    <section id="rsvp" ref={sectionRef} className="py-24 px-6 bg-cream">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-5">
            RSVP
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-6xl mb-5">Are You Coming?</h2>
          <p className="font-sans text-muted text-sm max-w-xs mx-auto leading-relaxed">
            Let us know by <span className="text-dark font-medium">1st October 2026</span> so we
            can save you a seat — and a plate of biryani.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-6"
            >
              {/* Name */}
              <div>
                <label className={labelCls}>
                  Full name <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Email */}
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  placeholder="So we can reach you"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Number of guests — always visible */}
              <div>
                <label className={labelCls}>
                  How many people in your party? <span className="text-terracotta">*</span>
                </label>
                <p className="font-sans text-[10px] text-muted/60 mb-2">
                  One person can RSVP for the whole family — just enter the total headcount.
                </p>
                <input
                  type="number"
                  min={1}
                  max={50}
                  required
                  value={form.guests}
                  onChange={(e) => setForm((p) => ({ ...p, guests: e.target.value }))}
                  className={inputCls}
                />
              </div>

              {/* Attending toggle */}
              <div>
                <label className={labelCls}>
                  Will you be joining us? <span className="text-terracotta">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['yes', 'no'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setForm((p) => ({ ...p, attending: v })); setError(null) }}
                      className={`py-3.5 font-sans text-[11px] tracking-[0.2em] uppercase border transition-colors duration-150 ${
                        form.attending === v
                          ? 'bg-dark text-cream border-dark'
                          : 'border-dark/15 text-muted hover:border-dark/35 hover:text-dark'
                      }`}
                    >
                      {v === 'yes' ? 'Joyfully, yes!' : "Can't make it"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional: yes-only fields */}
              <AnimatePresence>
                {form.attending === 'yes' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6 overflow-hidden"
                  >
                    {/* Functions */}
                    <div>
                      <label className={labelCls}>Which functions will you attend?</label>
                      <div className="flex flex-col gap-2">
                        {FUNCTION_LIST.map((fn) => (
                          <button
                            key={fn}
                            type="button"
                            onClick={() => toggleFunction(fn)}
                            className={`text-left px-4 py-3.5 border font-sans text-sm transition-colors duration-150 ${
                              form.functions.includes(fn)
                                ? 'border-terracotta/60 bg-terracotta/5 text-dark'
                                : 'border-dark/10 text-muted hover:border-dark/25 hover:text-dark'
                            }`}
                          >
                            <span
                              className={`inline-block w-3.5 h-3.5 border mr-3 relative top-px transition-colors ${
                                form.functions.includes(fn)
                                  ? 'bg-terracotta border-terracotta'
                                  : 'border-dark/25'
                              }`}
                            />
                            {fn}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dietary preference */}
                    <div>
                      <label className={labelCls}>Dietary preference</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['veg', 'non-veg'] as const).map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setForm((p) => ({ ...p, diet: d }))}
                            className={`py-3.5 font-sans text-[11px] tracking-[0.2em] uppercase border transition-colors duration-150 ${
                              form.diet === d
                                ? 'bg-dark text-cream border-dark'
                                : 'border-dark/15 text-muted hover:border-dark/35 hover:text-dark'
                            }`}
                          >
                            {d === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Message */}
              <div>
                <label className={labelCls}>
                  Anything else?{' '}
                  <span className="text-muted/50 normal-case tracking-normal">(optional)</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Questions, allergies, special requests, declarations of love..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>

              {error && (
                <p className="font-sans text-[11px] text-red-500 text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={!form.name.trim() || submitting}
                className="mt-1 py-4 bg-dark text-cream font-sans text-[11px] tracking-[0.22em] uppercase hover:bg-terracotta disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? 'Sending…' : 'Send RSVP'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-16"
            >
              {form.attending === 'yes' ? (
                <>
                  <p className="font-serif text-dark text-4xl mb-4">We&rsquo;ll see you there.</p>
                  <p className="font-sans text-muted text-sm leading-relaxed max-w-xs mx-auto">
                    {form.name}, your RSVP is noted. We&rsquo;re so excited to celebrate with you
                    {parseInt(form.guests) > 1 ? ` and your ${parseInt(form.guests) - 1} guest${parseInt(form.guests) > 2 ? 's' : ''}` : ''}.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-serif text-dark text-4xl mb-4">We&rsquo;ll miss you.</p>
                  <p className="font-sans text-muted text-sm leading-relaxed max-w-xs mx-auto">
                    {form.name}, we&rsquo;re sorry you can&rsquo;t make it — but we&rsquo;re grateful
                    you&rsquo;re part of our story.
                  </p>
                </>
              )}
              <button
                onClick={() => { setForm(INITIAL); setSubmitted(false) }}
                className="mt-10 font-sans text-[10px] tracking-[0.2em] uppercase text-muted hover:text-dark transition-colors"
              >
                Update my response
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
