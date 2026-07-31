'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const DO_THIS = [
  {
    title: 'Festive & colourful',
    body: 'Sarees, sherwanis, lehengas, suits, dresses — all of it, all welcome. Think: looks good in a photo, feels good on a dance floor.',
  },
  {
    title: 'Something you can dance in',
    body: 'The dance floor is not optional. You will be dancing. Plan accordingly.',
  },
  {
    title: 'Anything that makes you feel spectacular',
    body: "That is the only real criterion. If you feel great, you'll look great. We trust you.",
  },
]

const NOT_THIS = [
  {
    title: 'White',
    body: "We have enormous respect for bold choices. Not at our wedding, though. You know the rules.",
  },
  {
    title: 'Anything job-interview adjacent',
    body: "This is a celebration, not a performance review. You're allowed to have fun.",
  },
]

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function DressCode() {
  return (
    <section id="dresscode" className="py-24 px-6 bg-cream">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-4">
            The Dress Code
          </p>
          <h2 className="font-serif text-dark text-5xl md:text-6xl mb-4">
            What to Wear
          </h2>
          <p className="font-sans text-muted text-sm max-w-sm mx-auto">
            Or, more precisely: what to wear so Katyayani doesn&rsquo;t have opinions about it.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1px_1fr] gap-10 md:gap-0">
          {/* DO THIS */}
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-terracotta mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-terracotta/25" />
              Yes, please
              <span className="flex-1 h-px bg-terracotta/25" />
            </p>
            <div className="flex flex-col gap-5">
              {DO_THIS.map((item, i) => (
                <FadeCard key={item.title} delay={i * 0.1}>
                  <div className="border-l-2 border-terracotta/40 pl-5">
                    <h3 className="font-serif text-dark text-xl mb-1">{item.title}</h3>
                    <p className="font-sans text-muted text-sm leading-relaxed">{item.body}</p>
                  </div>
                </FadeCard>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block bg-terracotta/10 mx-10" />

          {/* NOT THIS */}
          <div>
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-muted mb-6 flex items-center gap-3">
              <span className="flex-1 h-px bg-dark/10" />
              Please don&rsquo;t
              <span className="flex-1 h-px bg-dark/10" />
            </p>
            <div className="flex flex-col gap-5">
              {NOT_THIS.map((item, i) => (
                <FadeCard key={item.title} delay={i * 0.1 + 0.2}>
                  <div className="border-l-2 border-dark/10 pl-5">
                    <h3 className="font-serif text-dark text-xl mb-1">{item.title}</h3>
                    <p className="font-sans text-muted text-sm leading-relaxed">{item.body}</p>
                  </div>
                </FadeCard>
              ))}
            </div>
          </div>
        </div>

        <FadeCard delay={0.4}>
          <p className="font-serif italic text-muted text-center text-lg mt-14">
            &ldquo;When in doubt: overdressed is always better than underdressed.&rdquo;
          </p>
          <p className="font-sans text-[10px] tracking-widest uppercase text-terracotta/60 text-center mt-2">
            — Katyayani&rsquo;s family, unanimously
          </p>
        </FadeCard>
      </div>
    </section>
  )
}
