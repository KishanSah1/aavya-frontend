'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowRight,
  BadgeCheck,
  FlaskConical,
  Leaf,
  Maximize2,
  ShieldCheck,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'
import Button from '@/app/components/ui/Button'

interface Cert {
  id: string
  name: string
  sub: string
  tagline: string
  icon: LucideIcon
  /** One line for the lightbox — why this credential matters for buyers */
  trustBlurb: string
}

const CERT_SVG: Record<string, string> = {
  fssai: '/aavya/cert-fssai.svg',
  nabl: '/aavya/cert-nabl.svg',
  a2: '/aavya/cert-a2milk.svg',
}

const CERTS: Cert[] = [
  {
    id: 'fssai',
    name: 'FSSAI',
    sub: 'Licensed',
    tagline: "India's highest food safety authority",
    icon: ShieldCheck,
    trustBlurb: 'Central licensing means every batch is produced under audited food-safety standards you can rely on.',
  },
  {
    id: 'nabl',
    name: 'NABL',
    sub: 'Lab Verified',
    tagline: 'Every batch independently tested',
    icon: FlaskConical,
    trustBlurb: 'NABL-accredited labs test independently so purity and composition are verified—not just claimed.',
  },
  {
    id: 'a2',
    name: 'A2 Milk',
    sub: 'Certified',
    tagline: 'Genuine Gir cow A2 beta-casein',
    icon: Leaf,
    trustBlurb: 'A2 β-casein certification confirms the milk matches what we promise on the label, from indigenous Gir cows.',
  },
]

function CertificateLightbox({ cert, onClose }: { cert: Cert; onClose: () => void }) {
  const Icon = cert.icon
  const titleId = useId()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[99] flex items-end justify-center sm:items-center p-0 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="cert-lightbox-backdrop absolute inset-0 bg-[#1a2e1a]/55 backdrop-blur-md"
        aria-hidden
        onClick={onClose}
      />

      <div className="cert-lightbox-dialog relative z-10 flex w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.75rem] border border-secondary/15 bg-[#FDFCF0] shadow-[0_-12px_48px_rgba(0,0,0,0.18)] sm:rounded-3xl sm:shadow-2xl sm:max-h-[min(92vh,880px)]">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-green shrink-0" />

        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 sm:px-7 sm:pt-6">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary ring-1 ring-secondary/20">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 pt-0.5">
              <div className="mb-1 inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-secondary ring-1 ring-secondary/15">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
                Verified document
              </div>
              <h2 id={titleId} className="text-xl font-extrabold tracking-tight text-text-primary sm:text-2xl">
                {cert.name} · {cert.sub}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary/85">{cert.trustBlurb}</p>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-text-secondary/70 transition-colors hover:bg-black/[0.04] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        {/* Certificate frame */}
        <div className="mx-4 mb-4 flex min-h-0 flex-1 flex-col rounded-2xl border border-secondary/12 bg-[#FFFEF5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_24px_rgba(46,125,50,0.06)] sm:mx-7 sm:mb-5">
          <div className="max-h-[min(52vh,480px)] min-h-[200px] flex-1 overflow-auto p-3 sm:max-h-[min(58vh,560px)] sm:p-5">
            <img
              src={CERT_SVG[cert.id]}
              alt={`Official ${cert.name} certificate for Aavya Foods`}
              className="mx-auto w-full max-w-[640px] select-none rounded-lg shadow-sm"
              draggable={false}
            />
          </div>
          <p className="border-t border-secondary/[0.08] px-4 py-3 text-center text-[11px] leading-snug text-text-secondary/55 sm:text-xs">
            Displayed for transparency. Details on the certificate are representative of our compliance programme.
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-secondary/10 bg-white/60 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
          <p className="text-center text-sm font-medium text-text-secondary sm:text-left">
            Shop knowing what goes into every jar.
          </p>
          <Button href="/products" variant="primary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
            Browse products
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function CertCard({ cert, onOpenCert }: { cert: Cert; onOpenCert: (c: Cert) => void }) {
  const Icon = cert.icon

  return (
    <div
      className="flip-card w-full h-[370px] outline-none"
      role="region"
      tabIndex={0}
      aria-label={`${cert.name} certification. Press Enter or Space to flip the card.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const el = e.target as HTMLElement
          if (el.closest('button')) return
          e.preventDefault()
          ;(e.currentTarget as HTMLElement).classList.toggle('is-flipped')
        }
      }}
    >
      <div className="flip-card-inner rounded-2xl">
        {/* ── FRONT ── */}
        <div className="flip-card-face flip-card-front flex flex-col items-center justify-between bg-[#FDFCF0] border border-primary/20 rounded-2xl p-6 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-t-2xl" />

          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-primary/50 animate-badge-spin" />
            <div className="absolute inset-[10px] rounded-full border border-primary/20" />
            <div className="absolute inset-[18px] rounded-full bg-secondary/8 border border-secondary/20 flex items-center justify-center">
              <Icon className="w-9 h-9 text-secondary" strokeWidth={1.5} />
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                <div className="absolute top-[3px] left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-primary/60" />
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5">{cert.sub}</p>
            <h3 className="text-text-primary font-extrabold text-2xl leading-tight">{cert.name}</h3>
            <p className="text-text-secondary/60 text-xs mt-2 leading-relaxed">{cert.tagline}</p>
          </div>

          <div className="flex items-center gap-2 text-secondary/35 text-[10px]">
            <span className="w-4 h-px bg-secondary/25" />
            hover to flip · then open certificate
            <span className="w-4 h-px bg-secondary/25" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary/0 via-secondary/40 to-secondary/0 rounded-b-2xl" />
        </div>

        {/* ── BACK (official certificate — opens lightbox) ── */}
        <div className="flip-card-face flip-card-back rounded-2xl overflow-hidden bg-[#FFFEF5] border border-primary/15">
          <button
            type="button"
            className="flex h-full w-full min-h-0 cursor-zoom-in flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-secondary"
            onClick={() => onOpenCert(cert)}
            aria-label={`Open full ${cert.name} certificate in a window`}
          >
            <span className="flex min-h-0 flex-1 items-center justify-center p-2 sm:p-3">
              <img
                src={CERT_SVG[cert.id]}
                alt=""
                className="max-h-full w-full object-contain object-center select-none"
                draggable={false}
              />
            </span>
            <span className="flex shrink-0 items-center justify-center gap-1.5 border-t border-secondary/10 bg-secondary/[0.04] py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-secondary/80">
              <Maximize2 className="h-3.5 w-3.5 opacity-80" aria-hidden />
              View full certificate
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function CertificationsSection() {
  const [lightboxId, setLightboxId] = useState<string | null>(null)
  const closeLightbox = useCallback(() => setLightboxId(null), [])
  const lightboxCert = lightboxId ? CERTS.find((c) => c.id === lightboxId) : undefined

  return (
    <>
      <section className="relative bg-background py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #2E7D32 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto">
          <ScrollReveal animation="up">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-10 bg-gradient-green" />
                <span className="text-gradient-green font-semibold text-xs uppercase tracking-[0.22em]">Verified Quality</span>
                <div className="h-px w-10 bg-gradient-green" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
                Standards We Never Compromise On
              </h2>
              <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
                Hover a card to flip it, then tap the certificate to view it full size—no fine print, just proof.
              </p>
              <div className="w-14 h-[3px] bg-gradient-green rounded-full mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CERTS.map((cert, i) => (
              <ScrollReveal key={cert.id} animation="up" delay={i * 100}>
                <CertCard cert={cert} onOpenCert={(c) => setLightboxId(c.id)} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {lightboxCert ? <CertificateLightbox cert={lightboxCert} onClose={closeLightbox} /> : null}
    </>
  )
}
