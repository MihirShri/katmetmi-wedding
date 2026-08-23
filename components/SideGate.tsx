'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

type Side = 'bride' | 'groom'

const EASE = [0.16, 1, 0.3, 1] as const
const LS_KEY = 'katmetmi-side'

function PanelContent({ side, hovered }: { side: Side; hovered: Side | null }) {
  const isBride = side === 'bride'
  const textColor = isBride ? '#1A1108' : '#FDFAF6'
  const isHovered = hovered === side

  return (
    <div className="text-center pointer-events-none select-none" style={{ padding: '0 2rem' }}>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.55rem',
        letterSpacing: '0.38em',
        textTransform: 'uppercase',
        color: '#C9956C',
        marginBottom: '2rem',
      }}>
        I&rsquo;m here for
      </p>

      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2.4rem, 5.5vw, 6rem)',
        fontStyle: 'italic',
        fontWeight: 300,
        color: textColor,
        lineHeight: 0.9,
        marginBottom: '1.8rem',
      }}>
        Team<br />{isBride ? 'Bride' : 'Groom'}
      </h2>

      <div style={{ width: '2rem', height: '1px', backgroundColor: '#C9956C', margin: '0 auto 1.8rem', opacity: 0.6 }} />

      {/* Mobile: always visible */}
      <p className="md:hidden" style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#C9956C',
      }}>
        Click to enter &rarr;
      </p>

      {/* Desktop: appears on hover */}
      <motion.p
        className="hidden md:block"
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.65rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#C9956C',
        }}
      >
        Click to enter &rarr;
      </motion.p>
    </div>
  )
}

export default function SideGate() {
  const [show, setShow] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hovered, setHovered] = useState<Side | null>(null)
  const [exiting, setExiting] = useState(false)
  const exitIsMobile = useRef(false)

  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    if (!localStorage.getItem(LS_KEY)) setShow(true)

    const handleSwitch = () => {
      localStorage.removeItem(LS_KEY)
      setExiting(false)
      setHovered(null)
      setIsMobile(window.innerWidth < 768)
      setShow(true)
    }
    window.addEventListener('katmetmi-switch-side', handleSwitch)
    return () => window.removeEventListener('katmetmi-switch-side', handleSwitch)
  }, [])

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [show])

  if (!show) return null

  const handleSelect = (side: Side) => {
    if (exiting) return
    exitIsMobile.current = window.innerWidth < 768
    localStorage.setItem(LS_KEY, side)
    setExiting(true)
    setTimeout(() => {
      setShow(false)
      window.dispatchEvent(new CustomEvent('katmetmi-gate-closed'))
    }, 950)
  }

  // Desktop: animate width (flex-row main axis)
  // Mobile:  animate height (flex-col main axis) — hover never fires on touch so stays 50%
  const brideSize = hovered === 'groom' ? '38%' : hovered === 'bride' ? '62%' : '50%'
  const groomSize = hovered === 'bride' ? '38%' : hovered === 'groom' ? '62%' : '50%'
  const isMob = exitIsMobile.current

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden flex flex-col md:flex-row">

      {/* ── Bride panel ─────────────────────────────────────── */}
      <motion.div
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ backgroundColor: '#EDE0CC' }}
        animate={{
          ...(isMobile ? { height: brideSize } : { width: brideSize }),
          ...(exiting ? (isMob ? { y: '-100%' } : { x: '-100%' }) : {}),
        }}
        transition={{
          width:  { duration: 0.45, ease: EASE },
          height: { duration: 0.45, ease: EASE },
          x: { duration: 0.9, ease: EASE },
          y: { duration: 0.9, ease: EASE },
        }}
        onHoverStart={() => !exiting && setHovered('bride')}
        onHoverEnd={() => !exiting && setHovered(null)}
        onClick={() => handleSelect('bride')}
      >
        <span aria-hidden style={{
          position: 'absolute', bottom: '-1rem', left: '-1rem',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 'clamp(5rem, 15vw, 14rem)', fontWeight: 300,
          color: 'rgba(201,149,108,0.08)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          Bride
        </span>
        <PanelContent side="bride" hovered={hovered} />
      </motion.div>

      {/* ── Center divider ──────────────────────────────────── */}
      <div aria-hidden className="absolute pointer-events-none z-[5]
        top-1/2 left-0 right-0 h-px -translate-y-1/2
        md:left-1/2 md:top-0 md:bottom-0 md:h-auto md:w-px md:translate-y-0 md:-translate-x-1/2"
        style={{ backgroundColor: 'rgba(26,17,8,0.15)' }}
      />

      {/* ── Centre badge ────────────────────────────────────── */}
      <motion.div
        animate={{ opacity: exiting ? 0 : 1 }}
        transition={{ duration: 0.25 }}
        className="absolute z-[10] pointer-events-none"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div style={{
          background: '#1A1108', padding: '0.65rem 1.2rem',
          border: '1px solid rgba(201,149,108,0.35)',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          color: '#C9956C', fontSize: '0.85rem', letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
        }}>
          #KatMetMi
        </div>
      </motion.div>

      {/* ── Groom panel ─────────────────────────────────────── */}
      <motion.div
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ backgroundColor: '#1A1108' }}
        animate={{
          ...(isMobile ? { height: groomSize } : { width: groomSize }),
          ...(exiting ? (isMob ? { y: '100%' } : { x: '100%' }) : {}),
        }}
        transition={{
          width:  { duration: 0.45, ease: EASE },
          height: { duration: 0.45, ease: EASE },
          x: { duration: 0.9, ease: EASE },
          y: { duration: 0.9, ease: EASE },
        }}
        onHoverStart={() => !exiting && setHovered('groom')}
        onHoverEnd={() => !exiting && setHovered(null)}
        onClick={() => handleSelect('groom')}
      >
        <span aria-hidden style={{
          position: 'absolute', bottom: '-1rem', right: '-1rem',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 'clamp(5rem, 15vw, 14rem)', fontWeight: 300,
          color: 'rgba(253,250,246,0.04)', lineHeight: 1,
          userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>
          Groom
        </span>
        <PanelContent side="groom" hovered={hovered} />
      </motion.div>
    </div>
  )
}
