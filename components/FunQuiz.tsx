'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

const QUESTIONS = [
  {
    q: 'Who sent the very first message?',
    options: [
      'Katyayani — she is bold like that',
      'Mihir — after thinking for 20 mins',
      'It was a meme forward',
      'They matched on an app',
    ],
    correct: 1,
    fun: 'He typed it, deleted it, typed it again. You get the picture.',
  },
  {
    q: 'How did Mihir propose?',
    options: [
      'Surprise trip to Paris',
      'On a phone call',
      'Flash mob in Lucknow',
      'Via voice note (no eye contact)',
    ],
    correct: 1,
    fun: 'No ring box needed when the right words are said at the right moment.',
  },
  {
    q: 'Where did they meet in person for the first time?',
    options: ['Delhi', 'Mumbai', 'Lucknow', 'A dramatic airport arrival gate'],
    correct: 2,
    fun: "Lucknow — city of nawabs, chikankari, and apparently, love stories.",
  },
  {
    q: 'When did they get engaged?',
    options: ["Valentine's Day", "New Year's Day", "Women's Day", "A random Tuesday (very romantic)"],
    correct: 2,
    fun: "Women's Day. Katyayani deserves to be celebrated every single day.",
  },
] as const

const SCORE_MESSAGES = [
  {
    min: 4,
    emoji: '🎉',
    title: "You're practically family.",
    sub: "Either that, or you've been reading this website very carefully. No judgement.",
  },
  {
    min: 2,
    emoji: '👏',
    title: 'You pay attention.',
    sub: "That's more than half the wedding party. We appreciate you.",
  },
  {
    min: 1,
    emoji: '😅',
    title: 'Have you actually met them?',
    sub: "It's okay. The food will still be excellent.",
  },
  {
    min: 0,
    emoji: '😬',
    title: 'Bold of you to show up.',
    sub: "We're genuinely glad you did. There's plenty of biryani for everyone.",
  },
]

function fireConfetti() {
  const colors = ['#C9956C', '#B8935A', '#FDFAF6', '#F5EDE0']
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.55 }, colors })
  setTimeout(() =>
    confetti({ particleCount: 40, spread: 100, origin: { y: 0.5, x: 0.2 }, colors }), 200)
  setTimeout(() =>
    confetti({ particleCount: 40, spread: 100, origin: { y: 0.5, x: 0.8 }, colors }), 350)
}

export default function FunQuiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [done, setDone] = useState(false)

  const score = answers.filter(Boolean).length
  const result = SCORE_MESSAGES.find((m) => score >= m.min) ?? SCORE_MESSAGES[SCORE_MESSAGES.length - 1]

  const handleSelect = (idx: number) => {
    if (selected !== null) return
    setSelected(idx)
  }

  const handleNext = () => {
    if (selected === null) return
    const correct = selected === QUESTIONS[current].correct
    const newAnswers = [...answers, correct]
    setAnswers(newAnswers)

    if (current + 1 >= QUESTIONS.length) {
      setTimeout(() => {
        setDone(true)
        const finalScore = newAnswers.filter(Boolean).length
        if (finalScore >= 2) fireConfetti()
      }, 500)
    } else {
      setTimeout(() => {
        setCurrent((c) => c + 1)
        setSelected(null)
      }, 500)
    }
  }

  const reset = () => {
    setCurrent(0)
    setSelected(null)
    setAnswers([])
    setDone(false)
  }

  return (
    <section className="py-24 px-6 bg-dark">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-12">
          <p className="font-sans text-[11px] tracking-[0.32em] uppercase text-terracotta mb-4">
            A Small Test
          </p>
          <h2 className="font-serif text-cream text-5xl md:text-6xl mb-4">
            How Well Do You Know Us?
          </h2>
          <p className="font-sans text-cream/40 text-sm">No stakes. Except your reputation.</p>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={`q-${current}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.28 }}
            >
              <div className="flex gap-2 mb-8">
                {QUESTIONS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-px flex-1 transition-colors duration-300 ${
                      i < current ? 'bg-terracotta' : i === current ? 'bg-terracotta/50' : 'bg-cream/10'
                    }`}
                  />
                ))}
              </div>

              <p className="font-serif text-cream text-2xl leading-snug mb-8">
                {QUESTIONS[current].q}
              </p>

              <div className="flex flex-col gap-3">
                {QUESTIONS[current].options.map((opt, i) => {
                  const isSelected = selected === i
                  const isCorrect = i === QUESTIONS[current].correct
                  const revealed = selected !== null

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className={`text-left px-5 py-4 font-sans text-sm border transition-all duration-200 ${
                        revealed
                          ? isCorrect
                            ? 'border-terracotta bg-terracotta/10 text-cream'
                            : isSelected
                            ? 'border-red-900/60 bg-red-900/10 text-cream/50'
                            : 'border-cream/8 text-cream/30'
                          : isSelected
                          ? 'border-terracotta bg-terracotta/10 text-cream'
                          : 'border-cream/20 text-cream/70 hover:border-cream/40 hover:text-cream'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>

              {selected !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 font-sans text-xs text-cream/35 italic"
                >
                  {QUESTIONS[current].fun}
                </motion.p>
              )}

              {selected !== null && (
                <motion.button
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={handleNext}
                  className="mt-6 w-full py-3 border border-terracotta text-terracotta font-sans text-[11px] tracking-[0.2em] uppercase hover:bg-terracotta hover:text-dark transition-colors"
                >
                  {current + 1 >= QUESTIONS.length ? 'See Results' : 'Next Question'}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="text-5xl mb-6">{result.emoji}</div>
              <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-terracotta mb-3">
                {score} / {QUESTIONS.length} correct
              </p>
              <h3 className="font-serif text-cream text-3xl mb-4">{result.title}</h3>
              <p className="font-sans text-cream/40 text-sm mb-10">{result.sub}</p>
              <button
                onClick={reset}
                className="font-sans text-[10px] tracking-[0.2em] uppercase text-cream/25 hover:text-cream/60 transition-colors"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
