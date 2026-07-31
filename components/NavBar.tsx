'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useScroll, AnimatePresence } from 'framer-motion'

const HOME_LINKS = [
  { label: 'Our Story', href: '#story' },
  { label: 'Events', href: '#events' },
  { label: 'Lucknow', href: '#lucknow' },
  { label: 'RSVP', href: '#rsvp' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const navLinks = isHome
    ? HOME_LINKS
    : [
        { label: 'Home', href: '/' },
        ...HOME_LINKS.map((l) => ({ ...l, href: `/${l.href}` })),
      ]

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-terracotta z-[60] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen ? 'bg-dark/95 backdrop-blur-sm py-3' : 'py-5'
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <a
            href="/"
            onClick={closeMenu}
            className="font-serif italic text-cream text-xl tracking-wide"
          >
            #KatMetMi
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="font-sans text-[10px] tracking-[0.18em] uppercase text-cream/55 hover:text-cream transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex flex-col items-center justify-center gap-[5px] w-8 h-8"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              className="block w-5 h-0.5 bg-cream origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.18 }}
              className="block w-5 h-0.5 bg-cream origin-center"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.22 }}
              className="block w-5 h-0.5 bg-cream origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-dark flex flex-col items-center justify-center px-8"
          >
            <nav className="flex flex-col items-center gap-2 w-full">
              {navLinks.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif italic text-cream/80 hover:text-terracotta transition-colors py-4 text-center w-full border-b border-cream/8 last:border-0"
                  style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)' }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Decorative bottom note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.4 }}
              className="absolute bottom-10 font-sans text-[10px] tracking-[0.28em] uppercase text-cream/20"
            >
              26 November 2026 · Lucknow
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
