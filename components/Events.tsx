'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

// ── Particle burst system ─────────────────────────────────────────────────────

type Particle = {
  x: number; y: number
  vx: number; vy: number
  size: number; color: string; opacity: number
  rotation: number; rotationSpeed: number
  life: number; maxLife: number
  type: 'circle' | 'rect' | 'petal'
}

const H_COLS = ['#F0C115','#FFD700','#E8A020','#FFF176','#FFCA28','#C8960A','#FAE870']
const S_COLS = ['#E040FB','#FF4081','#40C4FF','#69F0AE','#FFD740','#FF6E40','#EA80FC','#18FFFF']
const W_COLS = ['#C9956C','#B8935A','#FAD4C0','#F4A0A0','#E8C0A0','#D4896C','#FDFAF6']
const R_COLS = ['#E8D5A3','#D4AF37','#F5F0E8','#C9B370','#BFA980','#FDFAF6','#E6C97A']

const rnd = (a: number, b: number) => a + Math.random() * (b - a)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

function haldiParticles(W: number, H: number): Particle[] {
  const n = W < 768 ? 30 : 50
  const cy = H * 0.45
  const out: Particle[] = []
  for (let side = 0; side < 2; side++) {
    const left = side === 0
    for (let i = 0; i < n; i++) {
      const angle = (left ? 0 : Math.PI) + (Math.random() - 0.5) * Math.PI * 0.75
      const spd = rnd(4, 10)
      out.push({ x: left ? -4 : W + 4, y: cy + rnd(-H * 0.2, H * 0.2),
        vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd - rnd(0, 3),
        size: rnd(4, 9), color: pick(H_COLS), opacity: 1,
        rotation: rnd(0, Math.PI * 2), rotationSpeed: 0,
        life: 0, maxLife: rnd(60, 100), type: 'circle' })
    }
  }
  return out
}

function sangeetParticles(W: number, H: number): Particle[] {
  const top = W < 768 ? 50 : 100
  const sides = W < 768 ? 12 : 22
  const out: Particle[] = []
  for (let i = 0; i < top; i++)
    out.push({ x: rnd(W * 0.1, W * 0.9), y: rnd(-60, -5),
      vx: rnd(-3, 3), vy: rnd(1, 4),
      size: rnd(5, 11), color: pick(S_COLS), opacity: 1,
      rotation: rnd(0, Math.PI * 2), rotationSpeed: rnd(-0.2, 0.2),
      life: 0, maxLife: rnd(90, 150), type: 'rect' })
  for (let s = 0; s < 2; s++) {
    const left = s === 0
    for (let i = 0; i < sides; i++)
      out.push({ x: left ? -5 : W + 5, y: rnd(H * 0.05, H * 0.4),
        vx: left ? rnd(3, 8) : -rnd(3, 8), vy: rnd(1, 3),
        size: rnd(5, 9), color: pick(S_COLS), opacity: 1,
        rotation: rnd(0, Math.PI * 2), rotationSpeed: rnd(-0.25, 0.25),
        life: 0, maxLife: rnd(70, 120), type: 'rect' })
  }
  return out
}

function weddingParticles(W: number, H: number): Particle[] {
  const n = W < 768 ? 30 : 55
  const out: Particle[] = []
  for (let i = 0; i < n; i++)
    out.push({ x: rnd(0, W), y: rnd(-100, -10),
      vx: rnd(-1, 1), vy: rnd(0.8, 1.8),
      size: rnd(10, 22), color: pick(W_COLS), opacity: rnd(0.7, 0.95),
      rotation: rnd(0, Math.PI * 2), rotationSpeed: rnd(-0.03, 0.03),
      life: 0, maxLife: rnd(140, 210), type: 'petal' })
  return out
}

function receptionParticles(W: number, H: number): Particle[] {
  const n = W < 768 ? 40 : 70
  const out: Particle[] = []
  for (let i = 0; i < n; i++)
    out.push({ x: rnd(0, W), y: rnd(-120, -10),
      vx: rnd(-1.5, 1.5), vy: rnd(0.6, 1.6),
      size: rnd(6, 14), color: pick(R_COLS), opacity: rnd(0.8, 1),
      rotation: rnd(0, Math.PI * 2), rotationSpeed: rnd(-0.05, 0.05),
      life: 0, maxLife: rnd(150, 230), type: 'rect' })
  return out
}

function stepParticle(p: Particle, id: string): boolean {
  p.life++; p.x += p.vx; p.y += p.vy; p.rotation += p.rotationSpeed
  if (id === 'haldi')           { p.vy += 0.2;  p.vx *= 0.97 }
  else if (id === 'sangeet')   { p.vy += 0.06; p.vx *= 0.995 }
  else if (id === 'reception') { p.vy += 0.03; p.vx += Math.sin(p.life * 0.03) * 0.03 }
  else                         { p.vy += 0.012; p.vx += Math.sin(p.life * 0.04) * 0.04 }
  const t = p.life / p.maxLife
  p.opacity = t < 0.65 ? 1 : Math.max(0, (1 - t) / 0.35)
  return p.life < p.maxLife && p.opacity > 0.005
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.globalAlpha = p.opacity
  ctx.fillStyle = p.color
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  if (p.type === 'circle') {
    ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill()
  } else if (p.type === 'rect') {
    ctx.fillRect(-p.size / 2, -p.size * 0.22, p.size, p.size * 0.44)
  } else {
    ctx.beginPath(); ctx.ellipse(0, 0, p.size / 2, p.size / 3.2, 0, 0, Math.PI * 2); ctx.fill()
  }
  ctx.restore()
}

function runBurst(eventId: string) {
  if (typeof window === 'undefined') return
  const W = window.innerWidth, H = window.innerHeight
  const canvas = document.createElement('canvas')
  Object.assign(canvas.style, { position:'fixed', top:'0', left:'0',
    width:'100%', height:'100%', pointerEvents:'none', zIndex:'999' })
  canvas.width = W; canvas.height = H
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  let particles =
    eventId === 'haldi'      ? haldiParticles(W, H) :
    eventId === 'sangeet'    ? sangeetParticles(W, H) :
    eventId === 'reception'  ? receptionParticles(W, H) :
                               weddingParticles(W, H)
  let raf: number
  const tick = () => {
    ctx.clearRect(0, 0, W, H)
    particles = particles.filter(p => { const a = stepParticle(p, eventId); if (a) drawParticle(ctx, p); return a })
    if (particles.length) raf = requestAnimationFrame(tick)
    else canvas.remove()
  }
  raf = requestAnimationFrame(tick)
  setTimeout(() => { cancelAnimationFrame(raf); if (canvas.parentNode) canvas.remove() }, 9000)
}

// ─────────────────────────────────────────────────────────────────────────────

type SubEvent = {
  time: string
  name: string
  note: string
  groomOnly?: boolean
}

type EventData = {
  id: string
  name: string
  day: string
  date: string
  time?: string
  dressCode: string
  dressNote: string
  // Panel theming
  panelBg: string       // text panel background color
  isDark: boolean       // false = dark text on light bg
  accent: string        // accent color for highlights
  decorGradient: string // decorative side gradient
  photoSide: 'left' | 'right'
  photo?: string        // optional: path to a real photo
  venue: string
  address: string
  mapsUrl: string
  subEvents?: SubEvent[]
}

const MAPS_URL = 'https://maps.app.goo.gl/zQsS3BYorbJtQsCbA'

const EVENTS: EventData[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    day: 'Day 1',
    date: '25 November 2026',
    time: '12 noon onwards',
    dressCode: 'Yellow',
    dressNote:
      'Every shade — mustard, turmeric, lemon, butter. The brighter the better. Yes, it will stain.',
    panelBg: '#9E6200',
    isDark: true,
    accent: '#F0C115',
    decorGradient: 'linear-gradient(145deg, #4A2200 0%, #9E6200 52%, #C8960A 100%)',
    photoSide: 'right',
    venue: 'Golden Blossom Imperial Resorts · Back Lawn',
    address: 'Lucknow, Uttar Pradesh',
    mapsUrl: MAPS_URL,
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    day: 'Day 1',
    date: '25 November 2026',
    time: '7:00 PM onwards',
    dressCode: 'Vibrant & Colorful',
    dressNote:
      'Think party. Think bold. Think every color at once. Overdressed is the only option here.',
    panelBg: '#110720',
    isDark: true,
    accent: '#E040FB',
    decorGradient:
      'linear-gradient(135deg, #BE0068 0%, #7B21B6 42%, #1A3CB0 78%, #0B7285 100%)',
    photoSide: 'left',
    venue: 'Golden Blossom Imperial Resorts · Banquet Hall 5',
    address: 'Lucknow, Uttar Pradesh',
    mapsUrl: MAPS_URL,
  },
  {
    id: 'wedding',
    name: 'The Wedding',
    day: 'Day 2',
    date: '26 November 2026',
    dressCode: 'Your Finest',
    dressNote:
      'Sarees, sherwanis, lehengas, suits — your best traditional Indian attire. No white, please.',
    panelBg: '#3A0808',
    isDark: true,
    accent: '#C9956C',
    decorGradient: 'linear-gradient(145deg, #6B1A1A 0%, #9A3E1A 55%, #C9956C 100%)',
    photoSide: 'right',
    venue: 'Golden Blossom Imperial Resorts · Front Lawn',
    address: 'Lucknow, Uttar Pradesh',
    mapsUrl: MAPS_URL,
    subEvents: [
      { time: '5:00 PM',      name: 'Baraat Assembly',    note: 'Get in position. The procession is about to take shape.', groomOnly: true },
      { time: '5:30 PM',      name: 'Baraat Departure',   note: 'Dhol, lights, chaos — in that order. Let\'s go.', groomOnly: true },
      { time: '6:30 PM',      name: 'Baraat',             note: 'The groom arrives. Lights, dhol, chaos — in that order.' },
      { time: '8:00 PM',      name: 'Jaimala',            note: 'The garlands are exchanged. The journey begins.' },
      { time: '9:00 PM',      name: 'Dinner & Blessings', note: 'Biryani, blessings, and a lot of happy crying.' },
      { time: '12 Midnight',  name: 'Phere',              note: 'Seven rounds, seven vows, one lifetime.' },
      { time: 'Taaron ki chaon mein', name: 'Vidai',       note: 'Have tissues ready. We definitely will.' },
    ],
  },
]

const RECEPTION_EVENT: EventData = {
  id: 'reception',
  name: 'Reception',
  day: 'Day 3',
  date: '27 November 2026',
  time: '7:00 PM onwards',
  dressCode: 'Formals',
  dressNote: 'Suits, blazers, tuxedos, sarees, gowns — your most dressed-up self. This one\'s for the photos.',
  panelBg: '#0A0F1E',
  isDark: true,
  accent: '#D4AF37',
  decorGradient: 'linear-gradient(145deg, #050810 0%, #0D1628 52%, #172040 100%)',
  photoSide: 'left',
  venue: 'Safed Baradari · Kaiser Bagh',
  address: 'Lucknow, Uttar Pradesh',
  mapsUrl: 'https://maps.app.goo.gl/pNjgMBJ3CprqyEKp6',
}

function EventPanel({ event, side }: { event: EventData; side: string | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const burstFired = useRef(false)

  useEffect(() => {
    if (inView && !burstFired.current) {
      burstFired.current = true
      const delay = event.id === 'haldi' ? 300 : event.id === 'sangeet' ? 400 : 500
      setTimeout(() => runBurst(event.id), delay)
    }
  }, [inView, event.id])

  const textColor = event.isDark ? '#FDFAF6' : '#1A1108'
  const mutedColor = event.isDark
    ? 'rgba(253,250,246,0.45)'
    : 'rgba(26,17,8,0.52)'
  const borderColor = event.isDark
    ? 'rgba(253,250,246,0.10)'
    : 'rgba(26,17,8,0.12)'
  const isPhotoRight = event.photoSide === 'right'

  // Text content panel
  const textPanel = (
    <div
      className="flex flex-col justify-center px-10 py-14 md:px-14 lg:px-20"
      style={{ backgroundColor: event.panelBg, minHeight: '58vh' }}
    >
      {/* Day / date row */}
      <div className="flex items-center gap-3 mb-5">
        <span
          className="font-sans text-[9px] tracking-[0.3em] uppercase px-3 py-1.5"
          style={{ backgroundColor: event.accent + '30', color: event.accent }}
        >
          {event.day}
        </span>
        <span
          className="font-sans text-[9px] tracking-[0.25em] uppercase"
          style={{ color: mutedColor }}
        >
          {event.date}
        </span>
      </div>

      {/* Big event name */}
      <h3
        className="font-serif leading-[0.88] mb-2"
        style={{ color: textColor, fontSize: 'clamp(3.5rem, 5.5vw, 6.5rem)' }}
      >
        {event.name}
      </h3>

      {event.time && (
        <p
          className="font-sans text-sm tracking-[0.12em] mb-8"
          style={{ color: mutedColor }}
        >
          {event.time}
        </p>
      )}

      {/* Accent line */}
      <div className="w-10 h-0.5 mb-8" style={{ backgroundColor: event.accent }} />

      {/* Dress code */}
      <div className="mb-8">
        <p
          className="font-sans text-[9px] tracking-[0.3em] uppercase mb-2"
          style={{ color: mutedColor }}
        >
          Dress Code
        </p>
        <p className="font-serif text-2xl mb-2" style={{ color: textColor }}>
          {event.dressCode}
        </p>
        <p
          className="font-sans text-xs leading-relaxed"
          style={{ color: mutedColor, maxWidth: '30rem' }}
        >
          {event.dressNote}
        </p>
      </div>

      {/* Sub-events (wedding) */}
      {event.subEvents && (() => {
        const visible = event.subEvents!.filter(s => !s.groomOnly || side === 'groom')
        if (!visible.length) return null
        return (
        <div
          className="mb-8 pl-4"
          style={{ borderLeft: `2px solid ${event.accent}55` }}
        >
          <p
            className="font-sans text-[9px] tracking-[0.3em] uppercase mb-4"
            style={{ color: mutedColor }}
          >
            Schedule
          </p>
          <div className="flex flex-col gap-4">
            {visible.map((sub) => (
              <div key={sub.name} className="grid grid-cols-[5.5rem_1fr] gap-3">
                <p
                  className="font-sans text-[11px] tracking-[0.08em] pt-0.5"
                  style={{ color: event.accent }}
                >
                  {sub.time}
                </p>
                <div>
                  <p
                    className="font-serif text-lg leading-tight"
                    style={{ color: textColor }}
                  >
                    {sub.name}
                  </p>
                  <p
                    className="font-sans text-[11px] mt-0.5"
                    style={{ color: mutedColor }}
                  >
                    {sub.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        )
      })()}

      {/* Venue */}
      <div
        className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <div>
          <p
            className="font-sans text-[9px] tracking-[0.3em] uppercase mb-1"
            style={{ color: mutedColor }}
          >
            Venue
          </p>
          <p className="font-serif text-xl" style={{ color: textColor }}>
            {event.venue}
          </p>
          <p className="font-sans text-xs mt-1" style={{ color: mutedColor }}>
            {event.address}
          </p>
        </div>
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 font-sans text-[10px] tracking-[0.2em] uppercase hover:opacity-75 transition-opacity duration-200"
          style={{ border: `1px solid ${event.accent}`, color: event.accent }}
        >
          Open in Maps
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 10L10 2M10 2H4M10 2V8"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  )

  // Decorative / photo panel
  const decorPanel = (
    <div
      className="hidden md:block relative overflow-hidden"
      style={{ background: event.decorGradient }}
    >
      {event.photo ? (
        <Image
          src={event.photo}
          alt={event.name}
          fill
          sizes="42vw"
          className="object-cover"
        />
      ) : (
        // Ghost watermark text as decoration until real photo is added
        <div className="absolute inset-0 flex items-end justify-start p-8 overflow-hidden">
          <span
            className="font-serif select-none pointer-events-none leading-none"
            style={{
              fontSize: 'clamp(5rem, 11vw, 13rem)',
              color: 'rgba(255,255,255,0.07)',
              fontStyle: 'italic',
            }}
          >
            {event.name}
          </span>
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const }}
      className={`grid ${isPhotoRight ? 'md:grid-cols-[58fr_42fr]' : 'md:grid-cols-[42fr_58fr]'}`}
    >
      {isPhotoRight ? (
        <>
          {textPanel}
          {decorPanel}
        </>
      ) : (
        <>
          {decorPanel}
          {textPanel}
        </>
      )}
    </motion.div>
  )
}

export default function Events() {
  const [side, setSide] = useState<string | null>(null)

  useEffect(() => {
    setSide(localStorage.getItem('katmetmi-side'))
    const handler = () => setSide(localStorage.getItem('katmetmi-side'))
    window.addEventListener('katmetmi-gate-closed', handler)
    return () => window.removeEventListener('katmetmi-gate-closed', handler)
  }, [])

  const events = side === 'groom' ? [...EVENTS, RECEPTION_EVENT] : EVENTS

  return (
    <section id="events" className="overflow-hidden">
      {/* Section header — cream, links cleanly from Timeline */}
      <div className="bg-cream py-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-4">
            Mark Your Calendars
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-7xl">The Celebrations</h2>
        </motion.div>
      </div>

      {/* Full-bleed event panels */}
      {events.map((event) => (
        <EventPanel key={event.id} event={event} side={side} />
      ))}

    </section>
  )
}
