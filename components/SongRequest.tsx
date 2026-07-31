'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUCCESS_LINES = [
  "Noted. No promises — but noted.",
  "Added to the list. Mihir will have feelings about this.",
  "On the list. The DJ's problem now.",
  "Excellent. Katyayani is already judging it (affectionately).",
]

export default function SongRequest() {
  const [form, setForm] = useState({ song: '', artist: '', from: '' })
  const [submitted, setSubmitted] = useState(false)
  const [successLine, setSuccessLine] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.song.trim()) return
    try {
      await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } catch {
      // show success regardless — worst case the request didn't save
    }
    setSuccessLine(SUCCESS_LINES[Math.floor(Math.random() * SUCCESS_LINES.length)])
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm({ song: '', artist: '', from: '' })
    setSubmitted(false)
    setSuccessLine('')
  }

  return (
    <section id="playlist" className="py-24 px-6 bg-sand">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-4">
            The Playlist
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-6xl mb-4">
            Request a Song
          </h2>
          <p className="font-sans text-muted text-sm max-w-xs mx-auto">
            Consider this a democracy. Sort of. We reserve the right to veto
            anything that would embarrass us in front of relatives.
          </p>
        </div>

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
              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                  Song name <span className="text-terracotta">*</span>
                </label>
                <input
                  type="text"
                  name="song"
                  value={form.song}
                  onChange={handleChange}
                  placeholder="e.g. Tum Hi Ho"
                  required
                  className="bg-cream border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                  Artist
                </label>
                <input
                  type="text"
                  name="artist"
                  value={form.artist}
                  onChange={handleChange}
                  placeholder="e.g. Arijit Singh"
                  className="bg-cream border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/60 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted">
                  Who&rsquo;s asking? <span className="text-muted/40">(optional, but we&rsquo;ll know)</span>
                </label>
                <input
                  type="text"
                  name="from"
                  value={form.from}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="bg-cream border border-dark/10 px-4 py-3 font-sans text-sm text-dark placeholder-muted/40 focus:outline-none focus:border-terracotta/60 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="mt-2 py-3.5 bg-dark text-cream font-sans text-[11px] tracking-[0.22em] uppercase hover:bg-terracotta transition-colors duration-200"
              >
                Add to the playlist
              </button>

              <p className="font-sans text-[10px] text-muted/50 italic text-center mt-1">
                All decisions are final. Except Mihir&rsquo;s. Those get reviewed.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center py-10"
            >
              <div className="text-4xl mb-6">🎵</div>
              <h3 className="font-serif text-dark text-2xl mb-3">{successLine}</h3>
              {form.song && (
                <p className="font-sans text-muted text-sm mb-2">
                  <span className="font-medium text-dark">{form.song}</span>
                  {form.artist && <span> — {form.artist}</span>}
                </p>
              )}
              <button
                onClick={handleReset}
                className="mt-8 font-sans text-[10px] tracking-[0.2em] uppercase text-muted hover:text-dark transition-colors"
              >
                Request another song
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
