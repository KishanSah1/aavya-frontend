'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useId, useState } from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Flame,
  FlaskConical,
  Leaf,
  Minus,
  MilkOff,
  Moon,
  Package,
  Plus,
  RefreshCw,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import type { ProductDetail } from '@/lib/types'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/app/components/ui/Button'

// ─── Static data ─────────────────────────────────────────────────────────────

const DELIVERY_TRUST = [
  { icon: Truck, label: 'Free delivery above ₹999' },
  { icon: RefreshCw, label: '7-day easy returns' },
  { icon: ShieldCheck, label: 'Secure payments' },
] as const

const BILONA_STEPS = [
  {
    icon: MilkOff,
    step: '01',
    title: 'A2 Milk',
    desc: 'Sourced fresh from indigenous desi cows raised on natural pasture and feed.',
  },
  {
    icon: Moon,
    step: '02',
    title: 'Curd Setting',
    desc: 'Milk is gently warmed and fermented overnight to form thick, probiotic-rich curd.',
  },
  {
    icon: RotateCcw,
    step: '03',
    title: 'Bilona Churning',
    desc: 'Curd is hand-churned in a clay pot until butter slowly separates — the Vedic way.',
  },
  {
    icon: Flame,
    step: '04',
    title: 'Slow Cooking',
    desc: 'Butter is simmered over a gentle flame until it turns golden, nutty, and aromatic.',
  },
] as const

const PRODUCT_FAQS = [
  {
    q: 'How do I know this ghee is actually pure?',
    a: 'We follow the traditional Bilona method, made from curd, not cream. No chemicals, no shortcuts. You\'ll notice it in the aroma, texture, and taste.',
  },
  {
    q: 'Why is your ghee more expensive than regular ghee?',
    a: 'Because it\'s not mass-produced. From free-grazing Desi cows to slow churning, every step takes time, care, and honesty.',
  },
  {
    q: 'Does pure ghee really have a grainy texture?',
    a: 'Yes, that\'s a sign of authenticity. Bilona ghee naturally forms a slightly grainy texture when it sets.',
  },
  {
    q: 'Why does the smell feel stronger than other ghee?',
    a: 'That rich, nutty aroma is exactly what real ghee smells like. If your ghee smells mild, it\'s often over-processed.',
  },
  {
    q: 'Is this ghee suitable for daily use?',
    a: 'Absolutely. Pure ghee is easier to digest and can be used daily in cooking, meals, or even directly.',
  },
  {
    q: 'Why does the texture change in different seasons?',
    a: 'Because it\'s natural. Temperature affects ghee — it may solidify in winters and liquify in summers. That\'s purity, not a defect.',
  },
  {
    q: 'How is your ghee different from what I buy in stores?',
    a: 'Most store ghee is made from cream using machines. Ours is made from curd, hand-churned, and slow-cooked — the traditional way.',
  },
  {
    q: 'Will it feel heavy after eating?',
    a: 'No — in fact, many people find it lighter and easier to digest than regular ghee.',
  },
  {
    q: 'Can I trust the source of your milk?',
    a: 'Yes, we source from farms where Desi cows are free-grazed and naturally fed.',
  },
  {
    q: 'How should I store the ghee?',
    a: 'Keep it in a cool, dry place. No refrigeration needed — just keep it away from moisture.',
  },
] as const

const FEATURE_PILLS = [
  { icon: FlaskConical, label: 'Lab-tested quality' },
  { icon: Leaf, label: 'No preservatives' },
  { icon: Package, label: 'Tamper-proof packaging' },
] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatInr(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

function discountPct(price: number, mrp: number) {
  return Math.round(((mrp - price) / mrp) * 100)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function QtyButton({
  icon: Icon,
  onClick,
  label,
  filled,
}: {
  icon: typeof Minus
  onClick: () => void
  label: string
  filled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={[
        'w-11 h-11 rounded-full flex items-center justify-center transition-colors',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        filled
          ? 'bg-secondary text-white hover:bg-secondary/90'
          : 'bg-secondary/10 hover:bg-secondary/20 text-secondary',
      ].join(' ')}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

// ─── FAQ accordion ────────────────────────────────────────────────────────────

function ProductFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="mt-20 pt-14 border-t border-surface">
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-secondary font-semibold text-xs uppercase tracking-widest">
              Good to know
            </span>
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-primary">
            Frequently Asked Questions
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-4" />
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2.5">
          {PRODUCT_FAQS.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className="rounded-2xl border border-surface bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-semibold text-text-primary text-sm md:text-[15px] leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-secondary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>

                {/* Animated answer */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ProductDetailClient({ product }: { product: ProductDetail }) {
  const router = useRouter()
  const galleryId = useId()
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'shared'>('idle')

  const addItem = useCartStore((s) => s.addItem)
  const updateQty = useCartStore((s) => s.updateQty)

  const { images, name, weight, price, mrp, description, highlights, detailParagraphs, badge } = product
  const onSale = mrp != null && mrp > price
  const title = `${name} — ${weight}`

  const addToCartWithQty = useCallback(() => {
    addItem(product)
    if (qty > 1) updateQty(product.id, qty)
  }, [addItem, updateQty, product, qty])

  const handleBuyNow = useCallback(() => {
    addToCartWithQty()
    router.push('/cart')
  }, [addToCartWithQty, router])

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    try {
      if (navigator.share) {
        await navigator.share({ title, text: description ?? name, url })
        setShareStatus('shared')
      } else {
        await navigator.clipboard.writeText(url)
        setShareStatus('copied')
      }
    } catch {
      try {
        await navigator.clipboard.writeText(url)
        setShareStatus('copied')
      } catch {
        setShareStatus('idle')
      }
    }
    window.setTimeout(() => setShareStatus('idle'), 2200)
  }

  const goPrev = useCallback(() => setActive((i) => (i <= 0 ? images.length - 1 : i - 1)), [images.length])
  const goNext = useCallback(() => setActive((i) => (i >= images.length - 1 ? 0 : i + 1)), [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target
      if (el instanceof HTMLElement && el.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  return (
    <div className="bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-start">

          {/* Gallery */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <div
              className="relative aspect-square rounded-3xl overflow-hidden bg-surface shadow-lg ring-1 ring-black/[0.05]"
              role="region"
              aria-roledescription="carousel"
              aria-label="Product images"
            >
              {images.map((src, i) => (
                <div
                  key={src}
                  className={[
                    'absolute inset-0 transition-opacity duration-300 ease-out',
                    i === active ? 'opacity-100 z-[1]' : 'opacity-0 z-0 pointer-events-none',
                  ].join(' ')}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={src}
                    alt={`${title} — image ${i + 1} of ${images.length}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={i === 0}
                  />
                </div>
              ))}

              {badge && (
                <span className="absolute top-4 left-4 z-[2] bg-primary text-text-primary text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
                  {badge}
                </span>
              )}

              {/* Prev / next — only when multiple images */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 z-[2] flex gap-1 rounded-full bg-black/40 backdrop-blur-sm p-1">
                  {[
                    { label: 'Previous image', handler: goPrev, Icon: ChevronLeft },
                    { label: 'Next image', handler: goNext, Icon: ChevronRight },
                  ].map(({ label, handler, Icon }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={handler}
                      className="p-2 rounded-full text-white hover:bg-white/15 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      aria-controls={galleryId}
                      aria-label={label}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails — only when multiple images */}
            {images.length > 1 && (
              <div
                id={galleryId}
                className="flex gap-2.5 overflow-x-auto pb-1 snap-x snap-mandatory [scrollbar-width:thin]"
                role="tablist"
                aria-label="Choose product image"
              >
                {images.map((src, i) => {
                  const selected = i === active
                  return (
                    <button
                      key={`thumb-${i}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActive(i)}
                      className={[
                        'relative shrink-0 w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20 rounded-2xl overflow-hidden ring-2 transition-all snap-start',
                        selected
                          ? 'ring-secondary shadow-md scale-[1.03]'
                          : 'ring-transparent opacity-70 hover:opacity-100 hover:ring-surface',
                      ].join(' ')}
                    >
                      <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Product details ── */}
          <div className="min-w-0 flex flex-col gap-7">

            {/* Brand + name */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary mb-2">
                Aavya Foods · Pure &amp; Natural
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-[1.15] tracking-tight">
                {title}
              </h1>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
              <span className="text-3xl font-extrabold text-secondary tabular-nums">{formatInr(price)}</span>
              {onSale && (
                <>
                  <span className="text-lg text-text-secondary line-through tabular-nums">{formatInr(mrp!)}</span>
                  <span className="text-xs font-bold bg-primary/20 text-text-primary px-3 py-1 rounded-full">
                    Save {discountPct(price, mrp!)}%
                  </span>
                </>
              )}
              <span className="text-xs text-text-secondary self-end pb-0.5">incl. of all taxes</span>
            </div>

            {/* Qty stepper */}
            <div>
              <p className="text-sm font-semibold text-text-primary mb-3" id="qty-label">Quantity</p>
              <div
                className="inline-flex items-center gap-1.5 bg-secondary/5 border border-secondary/20 rounded-full px-2 py-2"
                role="group"
                aria-labelledby="qty-label"
              >
                <QtyButton
                  icon={Minus}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  label="Decrease quantity"
                />
                <span className="font-bold text-text-primary text-lg w-12 text-center tabular-nums">{qty}</span>
                <QtyButton
                  icon={Plus}
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  label="Increase quantity"
                  filled
                />
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={addToCartWithQty}
                leftIcon={<ShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Buy Now
              </Button>
            </div>
            <p className="text-xs text-text-secondary/60 -mt-2">
              UPI · Cards · Netbanking · Cash on Delivery
            </p>

            {/* Delivery trust strip */}
            <div className="flex flex-wrap gap-3 py-4 border-y border-surface">
              {DELIVERY_TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-text-secondary">
                  <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                  {label}
                </div>
              ))}
            </div>

            {/* Description */}
            {description && (
              <p className="text-text-secondary leading-relaxed text-[15px]">{description}</p>
            )}

            {/* Detail paragraphs */}
            {detailParagraphs.length > 0 && (
              <div className="space-y-3">
                {detailParagraphs.map((para, idx) => (
                  <p key={idx} className="text-text-secondary leading-relaxed text-[15px]">{para}</p>
                ))}
              </div>
            )}

            {/* Benefits */}
            {highlights && highlights.length > 0 && (
              <div className="rounded-2xl bg-primary/10 border border-primary/20 p-5">
                <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                  Why you&apos;ll love it
                </h2>
                <ul className="flex flex-col gap-2.5">
                  {highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-[14px] text-text-secondary">
                      <Leaf className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2.5">
              {FEATURE_PILLS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full bg-secondary/10 text-secondary px-4 py-2 text-xs font-semibold border border-secondary/20"
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden />
                  {label}
                </div>
              ))}
            </div>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-secondary-light transition-colors self-start"
            >
              <Share2 className="w-4 h-4" aria-hidden />
              {shareStatus === 'copied'
                ? 'Link copied!'
                : shareStatus === 'shared'
                  ? 'Thanks for sharing!'
                  : 'Share this product'}
            </button>
          </div>
        </div>

        {/* ── The Bilona Process ── */}
        <section className="mt-20 pt-14 border-t border-surface">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-secondary font-semibold text-xs uppercase tracking-widest">
                Crafted with care
              </span>
              <Leaf className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold text-text-primary mb-3">The Bilona Process</h2>
            <p className="text-text-secondary max-w-lg mx-auto text-sm leading-relaxed">
              An ancient Vedic method — slow, intentional, and unchanged for centuries. This is how every jar of Aavya ghee is born.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BILONA_STEPS.map(({ icon: Icon, step, title: stepTitle, desc }) => (
              <div
                key={step}
                className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-surface border border-surface hover:border-primary/20 hover:shadow-md transition-all duration-300 group"
              >
                <span className="text-4xl font-black text-primary/15 leading-none mb-4 select-none group-hover:text-primary/25 transition-colors">
                  {step}
                </span>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-text-primary text-base mb-2">{stepTitle}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <ProductFAQ />
      </div>
    </div>
  )
}
