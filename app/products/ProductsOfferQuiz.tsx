'use client'

import Image from 'next/image'
import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Check, CheckCircle2, Copy, Leaf, Sparkles, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Data ─────────────────────────────────────────────────────────────────────

type QuizOption = {
  value: 'a' | 'b' | 'c'
  label: string
  pure: boolean
}

type QuizQuestion = {
  id: string
  question: string
  options: [QuizOption, QuizOption, QuizOption]
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How does your ghee smell when heated?',
    options: [
      { value: 'a', label: 'Strong, natural aroma that fills the room', pure: true },
      { value: 'b', label: 'Very mild or no smell', pure: false },
      { value: 'c', label: 'Artificial or slightly burnt smell', pure: false },
    ],
  },
  {
    id: 'q2',
    question: 'What happens when your ghee solidifies?',
    options: [
      { value: 'a', label: 'Grainy texture forms naturally', pure: true },
      { value: 'b', label: 'Completely smooth like butter', pure: false },
      { value: 'c', label: 'Odd layers or separation', pure: false },
    ],
  },
  {
    id: 'q3',
    question: 'How is your ghee made?',
    options: [
      { value: 'a', label: 'From curd using traditional churning', pure: true },
      { value: 'b', label: 'Direct cream processing', pure: false },
      { value: 'c', label: 'Not sure', pure: false },
    ],
  },
  {
    id: 'q4',
    question: 'Why did you choose your current ghee?',
    options: [
      { value: 'a', label: 'Quality & trust', pure: true },
      { value: 'b', label: 'Price & availability', pure: false },
      { value: 'c', label: 'Never really thought about it', pure: false },
    ],
  },
  {
    id: 'q5',
    question: 'Does your ghee feel heavy after eating?',
    options: [
      { value: 'a', label: 'No, it feels light and digestible', pure: true },
      { value: 'b', label: 'Sometimes', pure: false },
      { value: 'c', label: 'Yes, often', pure: false },
    ],
  },
]

const OFFER_CODE = 'AAVYA15'
const OFFER_PERCENT = 15

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreCopy(score: number): { headline: string; body: string } {
  if (score === 5) return {
    headline: "You're a ghee connoisseur!",
    body: "Your answers reflect a deep appreciation for pure, traditional ghee. Here's a thank-you from us.",
  }
  if (score >= 3) return {
    headline: 'You know your ghee.',
    body: 'You tick most of the boxes of quality pure ghee. Try Aavya and taste what the bilona method truly feels like.',
  }
  return {
    headline: 'Your ghee might be letting you down.',
    body: 'Most people never question their ghee. Your answers suggest an upgrade could make a real difference at the table.',
  }
}

// ─── RadioBlock ───────────────────────────────────────────────────────────────

function RadioBlock({
  index,
  question,
  options,
  value,
  onChange,
}: {
  index: number
  question: string
  options: QuizOption[]
  value: string | undefined
  onChange: (v: string) => void
}) {
  const groupId = useId()

  return (
    <fieldset className="min-w-0">
      <legend
        id={`${groupId}-legend`}
        className="text-sm font-semibold text-text-primary leading-snug mb-2.5"
      >
        <span className="text-primary mr-1.5 font-bold">{index + 1}.</span>
        {question}
      </legend>

      <div
        role="radiogroup"
        aria-labelledby={`${groupId}-legend`}
        className="flex flex-col gap-2 [overflow-anchor:none]"
      >
        {options.map((opt) => {
          const checked = value === opt.value

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChange(opt.value)}
              onFocus={(e) => e.currentTarget.focus({ preventScroll: true })}
              className={cn(
                'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150',
                'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50',
                checked
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-gray-200 bg-white/70 hover:border-primary/30 hover:bg-primary/[0.04]',
              )}
            >
              {/* Letter bubble */}
              <span
                className={cn(
                  'shrink-0 w-6 h-6 rounded-full border text-[11px] font-bold flex items-center justify-center transition-colors',
                  checked
                    ? 'bg-primary border-primary text-text-primary'
                    : 'border-gray-300 text-gray-400 bg-transparent',
                )}
                aria-hidden
              >
                {opt.value.toUpperCase()}
              </span>

              <span className={cn(
                'text-sm leading-relaxed flex-1',
                checked ? 'text-text-primary' : 'text-text-secondary',
              )}>
                {opt.label}
              </span>

              {checked ? (
                <Check className="shrink-0 w-4 h-4 text-primary" strokeWidth={2.5} aria-hidden />
              ) : (
                <span className="shrink-0 w-4 h-4" aria-hidden />
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

// ─── SuccessScreen ────────────────────────────────────────────────────────────

function SuccessScreen({
  answers,
  onReset,
}: {
  answers: Record<string, string>
  onReset: () => void
}) {
  const [copied, setCopied] = useState(false)

  const score = useMemo(() =>
    QUESTIONS.reduce((acc, q) => {
      const option = q.options.find((o) => o.value === answers[q.id])
      return acc + (option?.pure ? 1 : 0)
    }, 0),
  [answers])

  const { headline, body } = scoreCopy(score)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(OFFER_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Score badge */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 bg-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" aria-hidden />
          Purity Score: {score} / {QUESTIONS.length}
        </span>
        <h2 className="text-lg font-extrabold text-text-primary leading-snug">{headline}</h2>
        <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{body}</p>
      </div>

      {/* Breakdown */}
      <div className="flex flex-col gap-1.5">
        {QUESTIONS.map((q, i) => {
          const option = q.options.find((o) => o.value === answers[q.id])
          const isPure = option?.pure ?? false
          return (
            <div
              key={q.id}
              className={cn(
                'flex items-start gap-3 rounded-xl px-3.5 py-2.5 border',
                isPure ? 'bg-primary/10 border-primary/20' : 'bg-gray-50 border-gray-100',
              )}
            >
              {isPure
                ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                : <XCircle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" aria-hidden />}
              <div className="min-w-0">
                <p className="text-[11px] text-text-secondary/50 mb-0.5 font-medium">Q{i + 1}</p>
                <p className="text-sm text-text-secondary leading-snug">{option?.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Offer code */}
      <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/10 p-5 text-center">
        <p className="text-xs text-text-secondary/70 mb-1 font-medium">Your exclusive discount code</p>
        <p className="font-mono text-2xl font-extrabold tracking-[0.22em] text-text-primary mb-4">
          {OFFER_CODE}
        </p>
        <button
          type="button"
          onClick={copyCode}
          className="w-full flex items-center justify-center gap-2 bg-gradient-green text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-[0.99] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Copy className="w-4 h-4" aria-hidden />
          {copied ? 'Copied!' : `Copy — ${OFFER_PERCENT}% off at checkout`}
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="self-center text-sm text-text-secondary/50 hover:text-text-primary underline-offset-4 hover:underline transition-colors"
      >
        Retake quiz
      </button>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProductsOfferQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [phase, setPhase] = useState<'quiz' | 'success'>('quiz')
  const questionsRef = useRef<HTMLDivElement>(null)
  const scrollLockRef = useRef<{ windowY: number; containerTop: number } | null>(null)

  const allAnswered = useMemo(
    () => QUESTIONS.every((q) => Boolean(answers[q.id])),
    [answers],
  )

  const setAnswer = useCallback((id: string, v: string) => {
    scrollLockRef.current = {
      windowY: window.scrollY,
      containerTop: questionsRef.current?.scrollTop ?? 0,
    }
    setAnswers((prev) => ({ ...prev, [id]: v }))
  }, [])

  useLayoutEffect(() => {
    const lock = scrollLockRef.current
    if (!lock) return
    scrollLockRef.current = null

    if (questionsRef.current) {
      questionsRef.current.scrollTop = lock.containerTop
    }
    if (Math.abs(window.scrollY - lock.windowY) > 1) {
      window.scrollTo({ top: lock.windowY, left: 0, behavior: 'auto' })
    }
  }, [answers])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (allAnswered) setPhase('success')
  }

  const handleReset = useCallback(() => {
    setPhase('quiz')
    setAnswers({})
  }, [])

  return (
    <section
      className="relative isolate overflow-hidden bg-[#FFFBF0]"
      aria-labelledby="quiz-heading"
    >
      {/* Background image */}
      <Image
        src="/aavya/quiz-section.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />

      {/* Warm honey-gold wash — light but lets the photo show through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(155deg, rgba(255, 252, 245, 0.78) 0%, rgba(255, 241, 190, 0.65) 42%, rgba(255, 247, 225, 0.75) 100%)',
        }}
        aria-hidden
      />

      <div className="relative max-w-lg mx-auto px-4 py-16 sm:py-20 lg:max-w-xl">
        {/* Eyebrow */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-primary" aria-hidden />
            <span className="text-secondary font-semibold text-xs uppercase tracking-widest">
              Member perk
            </span>
            <Leaf className="w-4 h-4 text-primary" aria-hidden />
          </div>
          <h2
            id="quiz-heading"
            className="text-3xl md:text-[2rem] font-extrabold text-secondary leading-tight"
          >
            Your Exclusive Offer Awaits
          </h2>
          <p className="mt-2.5 text-sm text-text-secondary max-w-sm mx-auto leading-relaxed">
            Complete a short questionnaire to unlock a special saving on your first Aavya order.
          </p>
          <div className="w-10 h-0.5 bg-primary rounded-full mx-auto mt-4 opacity-60" />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-secondary/10 bg-white/95 backdrop-blur-sm shadow-xl shadow-secondary/5 p-6 sm:p-8">
          {phase === 'quiz' ? (
            <form onSubmit={handleSubmit}>
              {/* Questions */}
              <div
                ref={questionsRef}
                className="space-y-6 max-h-[30rem] overflow-y-auto overscroll-contain [scrollbar-gutter:stable] [overflow-anchor:none] pr-1 -mr-1 [scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.12)_transparent]"
                role="region"
                aria-label="Ghee quality questionnaire"
              >
                {QUESTIONS.map((q, i) => (
                  <RadioBlock
                    key={q.id}
                    index={i}
                    question={q.question}
                    options={q.options}
                    value={answers[q.id]}
                    onChange={(v) => setAnswer(q.id, v)}
                  />
                ))}
              </div>

              {/* Footer */}
              <div className="mt-7 pt-5 border-t border-gray-200">
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mb-5" aria-hidden>
                  {QUESTIONS.map((q) => (
                    <span key={q.id} className="flex h-1.5 w-5 items-center justify-center">
                      <span
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300',
                          answers[q.id] ? 'w-5 bg-primary' : 'w-1.5 bg-gray-300',
                        )}
                      />
                    </span>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!allAnswered}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-green text-white font-bold py-3.5 rounded-xl hover:opacity-95 active:scale-[0.99] transition-[opacity,transform] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-35 disabled:cursor-not-allowed motion-reduce:active:scale-100"
                >
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
                  Unlock Your Special Saving
                </button>
                <p className="mt-3 text-center text-[11px] text-text-secondary/50 leading-relaxed">
                  One code per order · Cannot be combined with other promotions
                </p>
              </div>
            </form>
          ) : (
            <SuccessScreen answers={answers} onReset={handleReset} />
          )}
        </div>
      </div>
    </section>
  )
}
