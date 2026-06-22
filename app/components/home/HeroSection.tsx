'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const slides = [
  {
    src: '/aavya/hero-banner-1.png',
    alt: 'Pure Desi Cow Ghee — Aavya Foods',
    href: null,
  },
  {
    src: '/aavya/hero-banner-2.png',
    alt: 'Eat Light This Summer — A2 Gir Cow Ghee & Natural Jaggery',
    href: '/products',
  },
]

const INTERVAL = 5000

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((index: number) => {
    if (transitioning) return
    setTransitioning(true)
    setCurrent(index)
    setProgressKey(k => k + 1)
    setTimeout(() => setTransitioning(false), 700)
  }, [transitioning])

  const next = useCallback(() => {
    goTo((current + 1) % slides.length)
  }, [current, goTo])

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length)
  }, [current, goTo])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % slides.length
        setProgressKey(k => k + 1)
        return next
      })
    }, INTERVAL)
  }, [])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const handleArrow = useCallback((action: 'prev' | 'next') => {
    resetTimer()
    action === 'next' ? next() : prev()
  }, [resetTimer, next, prev])

  const handleDot = useCallback((i: number) => {
    resetTimer()
    goTo(i)
  }, [resetTimer, goTo])

  return (
    <section className="relative w-full overflow-hidden group select-none">
      {/* Slides track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const img = (
            <Image
              src={slide.src}
              alt={slide.alt}
              width={3180}
              height={1142}
              priority={i === 0}
              className={`w-full h-auto block ${i === current ? 'animate-ken-burns' : ''}`}
              key={i === current ? progressKey : undefined}
            />
          )
          return (
            <div key={slide.src} className="min-w-full relative overflow-hidden">
              {slide.href ? (
                <Link href={slide.href} className="block cursor-pointer">
                  {img}
                </Link>
              ) : img}
            </div>
          )
        })}
      </div>

      {/* Left arrow */}
      <button
        onClick={() => handleArrow('prev')}
        aria-label="Previous slide"
        className="
          absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-11 sm:h-11 rounded-full
          flex items-center justify-center
          bg-white/20 backdrop-blur-md border border-white/30
          text-white text-2xl font-light
          shadow-[0_4px_20px_rgba(0,0,0,0.2)]
          opacity-0 group-hover:opacity-100
          translate-x-2 group-hover:translate-x-0
          transition-all duration-300 ease-out
          hover:bg-white/40 hover:scale-110 active:scale-95
        "
      >
        ‹
      </button>

      {/* Right arrow */}
      <button
        onClick={() => handleArrow('next')}
        aria-label="Next slide"
        className="
          absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20
          w-9 h-9 sm:w-11 sm:h-11 rounded-full
          flex items-center justify-center
          bg-white/20 backdrop-blur-md border border-white/30
          text-white text-2xl font-light
          shadow-[0_4px_20px_rgba(0,0,0,0.2)]
          opacity-0 group-hover:opacity-100
          -translate-x-2 group-hover:translate-x-0
          transition-all duration-300 ease-out
          hover:bg-white/40 hover:scale-110 active:scale-95
        "
      >
        ›
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDot(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`
              rounded-full transition-all duration-500 ease-in-out
              ${i === current
                ? 'w-7 h-[6px] bg-[#E6B325] shadow-[0_0_8px_rgba(230,179,37,0.7)]'
                : 'w-[6px] h-[6px] bg-white/50 hover:bg-white/80 hover:scale-110'
              }
            `}
          />
        ))}
      </div>

      {/* Progress bar at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] bg-black/10 z-20">
        <div
          key={progressKey}
          className="h-full bg-gradient-to-r from-[#E6B325] to-[#C89B1F] animate-hero-progress"
          style={{ boxShadow: '0 0 8px rgba(230,179,37,0.6)' }}
        />
      </div>

      {/* Subtle bottom vignette for polish */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/15 to-transparent pointer-events-none z-10" />
    </section>
  )
}
