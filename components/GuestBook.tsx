'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Message = {
  id: string
  name: string
  text: string
}


function MessageTile({ message }: { message: Message }) {
  return (
    <div className="flex-shrink-0 w-72 md:w-80 border border-dark/8 bg-cream px-7 py-6 mx-3">
      <p className="font-serif text-dark/70 text-sm leading-relaxed italic mb-5">
        &ldquo;{message.text}&rdquo;
      </p>
      <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-terracotta">
        — {message.name}
      </p>
    </div>
  )
}

export default function GuestBook() {
  const [form, setForm] = useState({ name: '', text: '' })
  const [dbMessages, setDbMessages] = useState<Message[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [tickerPaused, setTickerPaused] = useState(false)
  const [flashMsg, setFlashMsg] = useState<Message | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!flashMsg) return
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = setTimeout(() => setFlashMsg(null), 4500)
    return () => { if (flashTimer.current) clearTimeout(flashTimer.current) }
  }, [flashMsg])

  useEffect(() => {
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then(({ messages }) => {
        if (Array.isArray(messages)) {
          setDbMessages(messages.map((m: { id: string; name: string; message: string }) => ({
            id: m.id,
            name: m.name,
            text: m.message,
          })))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    setSubmitting(true)
    setApiError(null)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, message: form.text }),
      })
      if (!res.ok) throw new Error()
      const newMsg: Message = { id: `temp-${Date.now()}`, name: form.name, text: form.text }
      setDbMessages((prev) => [...prev, newMsg])
      setFlashMsg(newMsg)
      setSubmitted(true)
      setForm({ name: '', text: '' })
    } catch {
      setApiError("Your words deserve better than a network error. Try once more?")
    } finally {
      setSubmitting(false)
    }
  }

  const ticker = [...dbMessages, ...dbMessages]

  return (
    <section id="guestbook" className="py-24 bg-sand overflow-hidden">
      {/* Form */}
      <div className="max-w-lg mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-5">
            Leave a Note
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-6xl mb-5">
            Blessings &amp; Messages
          </h2>
          <p className="font-sans text-muted text-sm max-w-xs mx-auto leading-relaxed">
            Drop us a message, a blessing, a bad joke — we&rsquo;ll take it all.
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
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                  Your name <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. The Sharma Family"
                  required
                  className="bg-cream border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                  Your message <span className="text-terracotta">*</span>
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  placeholder="A blessing, a wish, a memory, a bad joke..."
                  required
                  rows={4}
                  className="bg-cream border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/50 transition-colors resize-none"
                />
              </div>

              {apiError && (
                <p className="font-serif italic text-dark/50 text-sm text-center">{apiError}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 py-4 bg-dark text-cream font-sans text-[11px] tracking-[0.22em] uppercase hover:bg-terracotta disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {submitting ? 'Sending…' : 'Leave a blessing'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-12"
            >
              <p className="font-serif text-dark text-3xl mb-3">Thank you.</p>
              <p className="font-sans text-muted text-sm mb-10">
                Your words mean the world to us. Look for your message below.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted hover:text-dark transition-colors"
              >
                Leave another message
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Flash — new message slides in from right, exits left */}
      <AnimatePresence>
        {flashMsg && (
          <motion.div
            key={flashMsg.id}
            className="px-6 mb-8"
            initial={{ x: '100vw', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100vw', opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 160 }}
          >
            <div className="max-w-sm mx-auto border border-terracotta/60 bg-cream px-7 py-6 text-center">
              <p className="font-sans text-[9px] tracking-[0.32em] uppercase text-terracotta mb-3">
                Your blessing is in ✦
              </p>
              <p className="font-serif text-dark/70 text-sm leading-relaxed italic mb-4">
                &ldquo;{flashMsg.text}&rdquo;
              </p>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-terracotta">
                — {flashMsg.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticker */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-sand to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-sand to-transparent pointer-events-none" />

        <div
          className="flex"
          style={{
            width: 'max-content',
            animationName: 'ticker-scroll',
            animationDuration: '55s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationPlayState: tickerPaused ? 'paused' : 'running',
            willChange: 'transform',
          }}
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
        >
          {ticker.map((msg, i) => (
            <MessageTile key={`${msg.id}-${i}`} message={msg} />
          ))}
        </div>
      </div>
    </section>
  )
}
