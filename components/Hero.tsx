'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const WEDDING_DATE = new Date('2026-11-26T00:00:00')

function getTimeLeft(): TimeLeft {
  const diff = WEDDING_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

const UNITS = [
  { key: 'days' as const, label: 'Sunsets', sub: 'remaining' },
  { key: 'hours' as const, label: 'Hours', sub: 'give or take' },
  { key: 'minutes' as const, label: 'Minutes', sub: 'of peace left' },
  { key: 'seconds' as const, label: 'Heartbeats', sub: 'but who\'s counting' },
]

const EASE = [0.16, 1, 0.3, 1] as const

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [animReady, setAnimReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setMounted(true)
    setTimeLeft(getTimeLeft())
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // Returning visitor — side already chosen, animate immediately
    if (localStorage.getItem('katmetmi-side')) {
      setAnimReady(true)
      return
    }
    // First-time visitor — wait for gate to close
    const handler = () => setAnimReady(true)
    window.addEventListener('katmetmi-gate-closed', handler)
    return () => window.removeEventListener('katmetmi-gate-closed', handler)
  }, [])

  // Each element holds its initial state until animReady, then smoothly transitions
  const show = animReady

  return (
    <section className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

      {/* ─── Background photo — zooms out once gate closes ───────────────── */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.07 }}
        animate={{ scale: show ? 1 : 1.07 }}
        transition={{ duration: 2.6, ease: EASE }}
      >
        <Image
          src="/engagement.jpeg"
          alt="Katyayani & Mihir"
          fill
          className="object-cover object-center"
          priority
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/30 to-dark/70" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 100% at 50% 50%, transparent 40%, rgba(26,17,8,0.55) 100%)' }} />

      {/* ─── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center w-full max-w-2xl mx-auto">

        {/* #KatMetMi label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 1.0, delay: 0.8 }}
          className="font-sans text-[11px] tracking-[0.38em] uppercase text-terracotta mb-10 mt-14"
        >
          #KatMetMi
        </motion.p>

        {/* Names */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          transition={{ duration: 1.2, delay: 1.7 }}
        >
          <h1
            className="font-serif text-cream italic font-light leading-none"
            style={{ fontSize: 'clamp(3.2rem, 8.5vw, 7rem)' }}
          >
            Katyayani
          </h1>
          <p className="font-sans text-terracotta text-base tracking-[0.5em] my-5">&amp;</p>
          <h1
            className="font-serif text-cream italic font-light leading-none"
            style={{ fontSize: 'clamp(3.2rem, 8.5vw, 7rem)' }}
          >
            Mihir
          </h1>
        </motion.div>

        {/* Date — flanked by extending terracotta lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.0, delay: 2.9 }}
          className="flex items-center justify-center gap-4 mt-8 mb-3"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={show ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 3.1, ease: EASE }}
            className="h-px w-10 sm:w-14 bg-terracotta/55"
            style={{ transformOrigin: 'right' }}
          />
          <p
            className="font-sans tracking-[0.22em] uppercase date-shimmer shrink-0"
            style={{ fontSize: 'clamp(0.7rem, 1.8vw, 1rem)' }}
          >
            26 November 2026&nbsp;&nbsp;·&nbsp;&nbsp;Lucknow
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={show ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 3.1, ease: EASE }}
            className="h-px w-10 sm:w-14 bg-terracotta/55"
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>

        {/* Quirky countdown pre-label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 3.8 }}
          className="font-serif italic text-cream/25 text-sm mb-8"
        >
          not that anyone&rsquo;s counting.
        </motion.p>

        {/* Countdown boxes */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.9, delay: 4.4 }}
          className="flex gap-2 sm:gap-4 justify-center"
        >
          {UNITS.map((unit) => (
            <div key={unit.key} className="flex flex-col items-center gap-2">
              <div className="border border-terracotta/70 w-[68px] sm:w-[80px] h-[68px] sm:h-[80px] flex items-center justify-center">
                <span
                  className="font-serif text-cream text-2xl sm:text-3xl font-light"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {mounted ? String(timeLeft[unit.key]).padStart(2, '00') : '00'}
                </span>
              </div>
              <span className="font-sans text-[9px] tracking-[0.15em] uppercase text-cream/50">
                {unit.label}
              </span>
              <span className="font-sans text-[8px] italic text-cream/20 -mt-1">
                {unit.sub}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Quirky countdown post-label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={show ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 5.1 }}
          className="font-serif italic text-cream/20 text-xs mt-5"
        >
          it&rsquo;s Katyayani. she is absolutely counting.
        </motion.p>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 5.8, duration: 0.5 }}
      >
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-terracotta/50 to-transparent mx-auto"
          animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 0.15, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
