'use client'

import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] as const } },
}

const rule = {
  hidden: { scaleX: 0, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const } },
}

export default function StoryIntro() {
  return (
    <div className="bg-cream relative overflow-hidden flex flex-col items-center justify-center py-28 md:py-44 px-6 text-center">

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Label */}
        <motion.p
          variants={item}
          className="font-sans text-[10px] tracking-[0.4em] uppercase text-terracotta mb-7"
        >
          Seven Chapters · December 2020 — November 2026
        </motion.p>

        {/* Top rule */}
        <motion.div variants={rule} className="w-14 h-px bg-terracotta/35 mb-10 origin-left" />

        {/* Main heading */}
        <motion.h2
          variants={item}
          className="font-serif italic text-dark leading-[0.88] mb-7"
          style={{ fontSize: 'clamp(4.8rem, 12vw, 11rem)' }}
        >
          Our Story
        </motion.h2>

        {/* Subline — cheeky, references the actual story */}
        <motion.p
          variants={item}
          className="font-serif italic text-muted leading-relaxed mb-10"
          style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', maxWidth: '28rem' }}
        >
          A WhatsApp message. One accidental block.
          <br />One very good Sujoy.
        </motion.p>

        {/* Bottom rule */}
        <motion.div variants={rule} className="w-14 h-px bg-terracotta/35 mb-10 origin-right" />

        {/* CTA — links to story page */}
        <motion.a
          variants={item}
          href="/story"
          className="story-cta-pulse inline-flex items-center gap-3 px-8 py-3.5 font-sans text-[10px] tracking-[0.3em] uppercase"
        >
          Begin Reading
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut', repeatDelay: 0.4 }}
            className="inline-block"
          >
            →
          </motion.span>
        </motion.a>
      </motion.div>
    </div>
  )
}
