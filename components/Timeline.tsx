'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useScroll, useMotionValueEvent, useAnimation, useInView } from 'framer-motion'
import Image from 'next/image'

type Chapter = {
  number: string
  date: string
  tag: string
  headline: string
  body: React.ReactNode
  photoSide: 'left' | 'right' | 'none'
  bg: 'dark' | 'cream'
  photo?: string
  photoAlt?: string
  photoPosition?: string
}

const CHAPTERS: Chapter[] = [
  {
    number: '01',
    date: 'December 6, 2020',
    tag: 'The Matchmaker',
    headline: 'It started with\nan intern and\na complaint.',
    body: (
      <>
        Sujoy — Mihir&rsquo;s best friend from college — was interning at a startup called
        Zuperly. So was Katyayani. One random night, Sujoy asked if she could recommend
        someone for him.
        <br /><br />
        Out of irritation (her words, not ours), she fired back:{' '}
        <em>&ldquo;then you find someone for me.&rdquo;</em>
        <br /><br />
        Four minutes later, she had a number in her inbox.
      </>
    ),
    photoSide: 'right',
    bg: 'cream',
    photo: '/story/ch01.jpg',
    photoAlt: 'Katyayani and Mihir — early days',
  },
  {
    number: '02',
    date: 'December 7, 2020',
    tag: 'The First Text',
    headline: 'Twenty minutes.\nOne message.\nInstantly blocked.',
    body: (
      <>
        After staring at his phone for twenty full minutes, Mihir sent his opening line:
        <br /><br />
        <span className="font-serif text-xl italic text-terracotta block">
          &ldquo;Hey! getting blocked in 3..2..1..&rdquo;
        </span>
        <br />
        Bold. Ambitious. Incorrect.
        <br /><br />
        Message three is classified. Our friends know. We will never tell. What we will say:
        he was, in fact, blocked. Hours of apologizing followed — genuinely, embarrassingly,
        completely. Katyayani gave him one more chance. Mostly because Sujoy had a surprisingly
        good reputation.
      </>
    ),
    photoSide: 'left',
    bg: 'dark',
    photo: '/story/ch02.jpg',
    photoAlt: 'Katyayani and Mihir on the Brooklyn Bridge, New York',
  },
  {
    number: '03',
    date: 'February 14, 2021',
    tag: 'The Proposal',
    headline: 'He went full\nShah Rukh Khan.',
    body: (
      <>
        On a phone call. Valentine&rsquo;s Day. Mihir quoted{' '}
        <em>Jab Tak Hai Jaan</em> — verbatim, unprompted, apparently without shame:
        <br /><br />
        <span className="font-serif italic text-terracotta block leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
          &ldquo;Teri Aankhon Ki Namkeen Mastiyan<br />
          Teri Hansi Ki Beparwaah Gustakhiyaan<br />
          Teri Zulfon Ki Leharaati Angdaiyaan<br />
          Nahi Bhoolunga Main Jab Tak Hai Jaan, Jab Tak Hai Jaan&rdquo;
        </span>
        <br />
        Somehow, it worked. She said yes.
      </>
    ),
    photoSide: 'right',
    bg: 'cream',
    photo: '/story/ch03.jpg',
    photoAlt: 'The ring ceremony',
  },
  {
    number: '04',
    date: 'March 17, 2021',
    tag: '100 Days Later',
    headline: 'She got on a\ntrain to Lucknow.',
    body: (
      <>
        One hundred days of texts. Hundreds of hours on calls.
        <br /><br />
        Katyayani travelled all the way to Lucknow. The city of nawabs — known for its
        tehzeeb, its biryani, its poetry — witnessed something it hadn&rsquo;t scheduled:
        two people meeting for the first time who somehow already knew each other completely.
      </>
    ),
    photoSide: 'left',
    bg: 'dark',
    photo: '/story/ch04.jpg',
    photoAlt: 'Katyayani and Mihir dressed up together',
  },
  {
    number: '05',
    date: '2021 — 2026',
    tag: 'The In Between',
    headline: 'Degrees. Jobs.\nEleven countries.\nOne promise.',
    body: (
      <>
        College ended. Degrees collected. Cities changed.
        <br /><br />
        Mihir joined MathWorks. Then, in a move that surprised no one who knew them,
        Katyayani followed.
        <br /><br />
        Eleven countries. At some point, they stopped counting days apart and started
        counting passport stamps instead.
        <br /><br />
        On <strong>January 29th, 2026</strong>, in Oman, they exchanged promise rings.
        Five years in the making. One very good Sujoy.
      </>
    ),
    photoSide: 'right',
    bg: 'cream',
    photo: '/story/ch05.jpg',
    photoAlt: 'The promise ring moment in Oman — Mihir on one knee',
  },
  {
    number: '06',
    date: 'March 8, 2026',
    tag: 'The Engagement',
    headline: "Five years, and\nthen Women's Day.",
    body: (
      <>
        On the day the world celebrates women, Katyayani said yes to forever.
        <br /><br />
        The timing was entirely hers. Of course it was.
      </>
    ),
    photoSide: 'left',
    bg: 'dark',
    photo: '/story/ch06.jpg',
    photoAlt: 'Katyayani and Mihir at their engagement ceremony',
    photoPosition: 'center 80%',
  },
  {
    number: '07',
    date: 'November 26, 2026',
    tag: "What's Next",
    headline: 'And now,\nLucknow again.',
    body: (
      <>
        Where she came to meet him for the first time. Where the story comes full circle.
        <br /><br />
        We&rsquo;d love for you to be there.
        <br /><br />
        <a
          href="/#events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '2px',
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            border: '1px solid rgba(201,149,108,0.45)',
            color: '#C9956C',
            padding: '10px 22px',
            textDecoration: 'none',
            fontFamily: 'inherit',
            lineHeight: 1,
          }}
        >
          Come celebrate with us
          <span style={{ display: 'inline-block', transition: 'transform 0.3s ease' }}>→</span>
        </a>
      </>
    ),
    photoSide: 'none',
    bg: 'cream',
  },
]

// ─── Mobile: original stacked layout (unchanged) ─────────────────────────────

function MobileChapterCard({ chapter }: { chapter: Chapter }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const isDark = chapter.bg === 'dark'
  const bgHex = isDark ? '#1A1108' : '#FDFAF6'
  const textPrimary = isDark ? '#FDFAF6' : '#1A1108'
  const textMuted = isDark ? 'rgba(253,250,246,0.5)' : 'rgba(26,17,8,0.52)'

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
  })

  if (chapter.photoSide === 'none') {
    return (
      <div
        ref={ref}
        className="bg-cream flex flex-col items-center justify-center text-center px-6 py-32 relative overflow-hidden"
        style={{ minHeight: '60vh' }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 text-center font-serif italic select-none pointer-events-none leading-none text-dark"
          style={{ fontSize: 'clamp(12rem, 32vw, 26rem)', opacity: 0.04, top: '50%', transform: 'translateY(-50%)' }}
        >
          {chapter.number}
        </span>
        <div className="relative z-10 max-w-xl">
          <motion.div {...fade(0.05)}>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-terracotta mb-2">{chapter.tag}</p>
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-muted mb-10">{chapter.date}</p>
          </motion.div>
          <motion.h2 {...fade(0.18)} className="font-serif leading-[1.05] whitespace-pre-line mb-8 text-dark" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
            {chapter.headline}
          </motion.h2>
          <motion.div {...fade(0.32)} className="font-sans text-sm leading-[2.1] text-muted">
            {chapter.body}
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div ref={ref} style={{ backgroundColor: bgHex }}>
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(48vh, 62vh, 72vh)' }}>
        <Image src={chapter.photo!} alt={chapter.photoAlt ?? ''} fill sizes="100vw" className="object-cover" style={{ objectPosition: chapter.photoPosition ?? 'center' }} quality={85} priority={chapter.number === '01'} />
        <div className="absolute inset-x-0 bottom-0" style={{ height: '55%', background: `linear-gradient(to bottom, transparent, ${bgHex})` }} />
      </div>
      <div className="relative overflow-hidden">
        <span
          aria-hidden
          className="absolute inset-x-0 text-center font-serif italic leading-none select-none pointer-events-none"
          style={{ top: '1rem', fontSize: 'clamp(9rem, 26vw, 20rem)', color: isDark ? 'rgba(253,250,246,0.045)' : 'rgba(26,17,8,0.045)' }}
        >
          {chapter.number}
        </span>
        <div className="max-w-2xl mx-auto px-6 pt-2 pb-24 relative z-10">
          <motion.div {...fade(0.05)}>
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-terracotta mb-2">{chapter.tag}</p>
            <p className="font-sans text-[10px] tracking-[0.22em] uppercase mb-8" style={{ color: textMuted }}>{chapter.date}</p>
          </motion.div>
          <motion.h2 {...fade(0.18)} className="font-serif leading-[1.06] whitespace-pre-line mb-8" style={{ color: textPrimary, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}>
            {chapter.headline}
          </motion.h2>
          <motion.div {...fade(0.32)} className="font-sans text-sm leading-[2.1]" style={{ color: textMuted }}>
            {chapter.body}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Desktop: sticky open book with 3D page flip ─────────────────────────────

function DesktopBook() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [displayed, setDisplayed] = useState(0)
  const pageControls = useAnimation()
  const activeRef   = useRef(0)   // scroll-derived chapter index (no re-render)
  const flippingRef = useRef(false)

  const NUM = CHAPTERS.length // 7

  const flipTo = useCallback(async (next: number, prev: number) => {
    if (flippingRef.current) return
    flippingRef.current = true
    activeRef.current = next

    const forward = next > prev

    // Phase 1 — current page folds away (0° → edge-on)
    await pageControls.start({
      rotateY: forward ? -90 : 90,
      transition: { duration: 0.26, ease: [0.4, 0, 1, 1] as const },
    })

    // Swap content while the page is invisible (edge-on)
    setDisplayed(next)
    pageControls.set({ rotateY: forward ? 90 : -90 })

    // Phase 2 — new page unfolds into view (edge-on → 0°)
    await pageControls.start({
      rotateY: 0,
      transition: { duration: 0.26, ease: [0, 0, 0.2, 1] as const },
    })

    flippingRef.current = false
  }, [pageControls])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * NUM), NUM - 1)
    if (idx !== activeRef.current) {
      flipTo(idx, activeRef.current)
    }
  })

  const chapter = CHAPTERS[displayed]
  const isDark   = chapter.bg === 'dark'

  return (
    <div
      ref={containerRef}
      style={{ height: `${NUM * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">

        {/* ── Atmospheric background ── */}
        <motion.div
          className="absolute inset-0"
          animate={{ backgroundColor: isDark ? '#1A1108' : '#EDE0CC' }}
          transition={{ duration: 0.55 }}
        />
        {/* Soft radial glow behind the book */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: isDark
              ? 'radial-gradient(ellipse 75% 55% at 50% 52%, rgba(184,147,90,0.08) 0%, transparent 68%)'
              : 'radial-gradient(ellipse 75% 55% at 50% 52%, rgba(255,230,180,0.35) 0%, transparent 68%)',
          }}
          transition={{ duration: 0.55 }}
        />

        {/* ── The Book ── */}
        <div
          className="relative z-10"
          style={{ perspective: '2200px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            className="relative flex"
            style={{
              width:  'min(80vw, 1000px)',
              height: 'min(80vh, 720px)',
              boxShadow: '0 50px 130px rgba(0,0,0,0.7), 0 8px 30px rgba(0,0,0,0.4)',
            }}
          >

            {/* ── Left page — photo (or ornamental for ch07) ── */}
            <div
              className="relative flex-1 overflow-hidden"
              style={{ background: '#c8b49a', flexShrink: 0 }}
            >
              {chapter.photo ? (
                <motion.div
                  key={`photo-${displayed}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <Image
                    src={chapter.photo}
                    alt={chapter.photoAlt ?? ''}
                    fill
                    sizes="(min-width: 768px) 40vw, 80vw"
                    className="object-cover"
                    style={{ objectPosition: chapter.photoPosition ?? 'center' }}
                    quality={90}
                  />
                </motion.div>
              ) : (
                /* Chapter 07 left page — ornamental closing spread */
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf4ec] px-12 text-center">
                  <p
                    className="font-serif text-dark select-none"
                    style={{ fontSize: 'clamp(6rem, 12vw, 10rem)', opacity: 0.06, lineHeight: 1 }}
                  >
                    ∞
                  </p>
                  <div className="w-10 h-px bg-terracotta/30 my-5" />
                  <p className="font-sans text-[9px] tracking-[0.4em] uppercase text-terracotta">
                    26 · 11 · 2026
                  </p>
                  <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-muted/50 mt-2">
                    Lucknow
                  </p>
                </div>
              )}

              {/* Inner shadow on spine edge */}
              <div
                className="absolute inset-y-0 right-0 w-16 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.28))' }}
              />
              {/* Page edges */}
              <div className="absolute inset-x-0 top-0 h-px bg-black/15" />
              <div className="absolute inset-x-0 bottom-0 h-px bg-black/15" />

              {/* Chapter tag — bottom left, subtle */}
              {chapter.photo && (
                <div className="absolute bottom-5 left-7 z-10">
                  <p className="font-sans text-[8px] tracking-[0.32em] uppercase text-white/55 drop-shadow">
                    {chapter.tag}
                  </p>
                </div>
              )}
            </div>

            {/* ── Spine ── */}
            <div
              className="relative z-20 flex-shrink-0"
              style={{
                width: '18px',
                background:
                  'linear-gradient(to right, #060402 0%, #1a0e05 20%, #382010 45%, #4a2a14 50%, #382010 55%, #1a0e05 80%, #060402 100%)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)',
              }}
            />

            {/* ── Right page — the page that flips ── */}
            <motion.div
              className="relative flex-1 flex-shrink-0"
              style={{
                transformOrigin:  'left center',
                transformStyle:   'preserve-3d',
              }}
              animate={pageControls}
              initial={{ rotateY: 0 }}
            >
              {/* Front face — chapter text */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(105deg, #ede3d0 0%, #f8f2e8 8%, #faf4ec 100%)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Spine-side inner shadow */}
                <div
                  className="absolute inset-y-0 left-0 w-14 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.14))' }}
                />
                {/* Page edges */}
                <div className="absolute inset-x-0 top-0 h-px bg-black/10" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-black/10" />
                <div className="absolute inset-y-0 right-0 w-px bg-black/08" />

                {/* Chapter number — book-style top-right */}
                <div className="absolute top-7 right-9">
                  <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-dark/22">
                    {chapter.number}
                  </span>
                </div>

                {/* Main content — vertically centered */}
                <div className="absolute inset-0 flex flex-col justify-center px-11 xl:px-14 overflow-hidden">
                  <p className="font-sans text-[9px] tracking-[0.42em] uppercase text-terracotta mb-2.5">
                    {chapter.tag}
                  </p>
                  <p className="font-sans text-[9px] tracking-[0.22em] uppercase text-dark/32 mb-8">
                    {chapter.date}
                  </p>
                  <h2
                    className="font-serif leading-[1.1] whitespace-pre-line text-dark mb-7"
                    style={{ fontSize: 'clamp(1.55rem, 2.4vw, 2.7rem)' }}
                  >
                    {chapter.headline}
                  </h2>
                  <div
                    className="font-sans leading-[2.0] text-dark/52"
                    style={{ fontSize: 'clamp(11px, 0.95vw, 13px)' }}
                  >
                    {chapter.body}
                  </div>
                </div>

                {/* Page number — bottom right */}
                <div className="absolute bottom-6 right-9">
                  <span className="font-sans text-[9px] text-dark/18">{displayed + 1}</span>
                </div>
              </div>

              {/* Back face — visible during mid-flip (paper texture only) */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to left, #e8d8be, #d8c8aa)',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              />
            </motion.div>

          </div>

          {/* Book base shadow — simulates page stack thickness */}
          <div
            className="absolute inset-x-0 pointer-events-none"
            style={{
              top: '100%',
              height: '8px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45), transparent)',
            }}
          />
        </div>

        {/* ── Chapter progress dots — right side ── */}
        <div className="absolute right-7 xl:right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-10">
          {CHAPTERS.map((_, i) => (
            <motion.div
              key={i}
              className="rounded-full"
              style={{ width: '5px' }}
              animate={{
                height: i === displayed ? '20px' : '5px',
                backgroundColor:
                  i === displayed
                    ? (isDark ? '#C9956C' : '#B8935A')
                    : isDark
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(26,17,8,0.18)',
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* ── "Scroll to turn pages" hint — first chapter only ── */}
        {displayed === 0 && (
          <motion.p
            className="absolute bottom-8 left-1/2 -translate-x-1/2 font-sans text-[9px] tracking-[0.32em] uppercase z-10 whitespace-nowrap"
            style={{ color: isDark ? 'rgba(255,255,255,0.22)' : 'rgba(26,17,8,0.28)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            Scroll to turn pages
          </motion.p>
        )}

      </div>
    </div>
  )
}

// ─── Timeline: mobile + desktop ──────────────────────────────────────────────

export default function Timeline() {
  return (
    <div id="timeline">
      {/* Mobile: original stacked layout */}
      <div className="md:hidden">
        {CHAPTERS.map((chapter) => (
          <MobileChapterCard key={chapter.number} chapter={chapter} />
        ))}
      </div>

      {/* Desktop: sticky open book */}
      <div className="hidden md:block">
        <DesktopBook />
      </div>
    </div>
  )
}
