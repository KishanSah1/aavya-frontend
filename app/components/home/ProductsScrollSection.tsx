'use client'

import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useProducts } from '@/lib/queries/useProducts'
import Button from '@/app/components/ui/Button'
import ProductScrollCard from './ProductScrollCard'

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-52 rounded-2xl overflow-hidden border border-surface animate-pulse">
      <div className="h-48 bg-surface" />
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 bg-surface rounded w-3/4" />
        <div className="h-2.5 bg-surface rounded w-1/2" />
        <div className="h-5 bg-surface rounded w-1/3 mt-1" />
        <div className="flex gap-2 mt-1">
          <div className="flex-1 h-8 bg-surface rounded-full" />
          <div className="flex-1 h-8 bg-surface rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProductsScrollSection() {
  const { data: products, isLoading } = useProducts()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' })
  }

  return (
    <section className="py-14 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-gradient-green mb-1">
              Pure bilona ghee
            </p>
            <h2 className="text-3xl font-bold text-text-primary">
              Two jar sizes
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll arrows */}
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-surface flex items-center justify-center hover:border-secondary hover:text-secondary text-text-secondary transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-surface flex items-center justify-center hover:border-secondary hover:text-secondary text-text-secondary transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <Button
              href="/products"
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Jars & pricing
            </Button>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            : products?.map((product) => (
                <div key={product.id} className="snap-start">
                  <ProductScrollCard product={product} />
                </div>
              ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-6 text-center sm:hidden">
          <Button
            href="/products"
            size="md"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Jars & pricing
          </Button>
        </div>
      </div>
    </section>
  )
}
