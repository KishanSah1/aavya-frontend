import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Leaf } from 'lucide-react'
import ProductsGrid from './ProductsGrid'
import ProductsOfferQuiz from './ProductsOfferQuiz'
import BilonaComparisonSection from './BilonaComparisonSection'

export const metadata: Metadata = {
  title: 'Products | Aavya Foods',
  description:
    'Shop pure Bilona Cow Ghee — hand-churned the traditional way, free from additives, packed with natural goodness.',
}

const BADGES = ['100% Desi Milk', 'Bilona Method', 'No Additives', 'Farm Fresh']

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#FDFCF0] to-[#FDFCF7] border-b border-primary/10 overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-56 h-56 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 md:px-8 pt-8 pb-7 text-center">

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight leading-tight mb-2">
            Pure Ghee, <span className="text-secondary">Crafted with Tradition</span>
          </h1>

          {/* Subtitle */}
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto mb-5">
            Slow-churned from indigenous desi cow milk.{' '}
            <span className="font-semibold text-secondary">No shortcuts, no additives.</span>
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
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-square bg-surface" />
                <div className="p-7 flex flex-col gap-4">
                  <div className="h-6 bg-surface rounded-full w-2/3" />
                  <div className="h-12 bg-surface rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        }>
          <ProductsGrid />
        </Suspense>
      </section>

      <ProductsOfferQuiz />
      <BilonaComparisonSection />
    </div>
  )
}
