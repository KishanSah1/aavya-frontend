import type { Metadata } from 'next'
import { Leaf } from 'lucide-react'
import ProductsGrid from './ProductsGrid'
import ProductsOfferQuiz from './ProductsOfferQuiz'

export const metadata: Metadata = {
  title: 'Products | Aavya Foods',
  description:
    'Shop pure A2 Bilona Cow Ghee — hand-churned the traditional way, free from additives, packed with natural goodness.',
}

const BADGES = ['100% A2 Milk', 'Bilona Method', 'No Additives', 'Farm Direct']

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#FDFCF0] to-[#FDFCF7] border-b border-primary/10 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-7 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 text-secondary font-semibold text-[11px] uppercase tracking-[0.2em] mb-3">
            <Leaf className="w-3.5 h-3.5 text-primary" />
            Aavya Foods
            <Leaf className="w-3.5 h-3.5 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight mb-2">
            Pure Ghee, <span className="text-secondary">Crafted with Tradition</span>
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto mb-5">
            Slow-churned from indigenous desi cow milk. No shortcuts, no additives.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {BADGES.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 bg-white/70 border border-primary/15 text-text-primary text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-10">
        <ProductsGrid />
      </section>

      <ProductsOfferQuiz />
    </div>
  )
}
