import type { Metadata } from 'next'
import { Leaf } from 'lucide-react'
import ProductsGrid from './ProductsGrid'
import ProductsOfferQuiz from './ProductsOfferQuiz'

export const metadata: Metadata = {
  title: 'Products | Aavya Foods',
  description:
    'Shop pure A2 Bilona Cow Ghee — hand-churned the traditional way, free from additives, packed with natural goodness.',
}

const TRUST_BADGES = [
  { label: '100% Pure A2 Milk' },
  { label: 'No Preservatives' },
  { label: 'Hand-Churned Bilona' },
  { label: 'Farm to Doorstep' },
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page hero */}
      <section className="bg-gradient-to-b from-surface to-background border-b border-surface">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-10">
          {/* Heading */}
          <div className="flex items-center gap-2 mb-3">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-secondary font-semibold text-xs uppercase tracking-widest">
              Aavya Foods
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-4">
            Pure Ghee,<br className="hidden sm:block" /> Crafted with Tradition
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
            Every jar is slow-churned from the milk of indigenous desi cows — no shortcuts, no additives, just pure golden goodness.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-2 mt-6">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 bg-primary/15 text-text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full"
              >
                <Leaf className="w-3 h-3 text-primary" />
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-14">
        <ProductsGrid />
      </section>

      <ProductsOfferQuiz />
    </div>
  )
}
