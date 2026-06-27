'use client'

import { Leaf, ArrowRight } from 'lucide-react'
import { useProducts } from '@/lib/queries/useProducts'
import Button from '@/app/components/ui/Button'
import ProductCard from './ProductCard'
import ScrollReveal from '@/app/components/ScrollReveal'

function ProductSkeleton() {
  return (
    <div className="bg-surface rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="aspect-square bg-text-primary/10" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-4 bg-text-primary/10 rounded w-2/3" />
        <div className="h-3 bg-text-primary/10 rounded w-1/3" />
        <div className="h-6 bg-text-primary/10 rounded w-1/2 mt-2" />
        <div className="h-9 bg-text-primary/10 rounded-full mt-1" />
      </div>
    </div>
  )
}

export default function BestSellers() {
  const { data: products, isLoading, isError, refetch } = useProducts()

  return (
    <section className="relative bg-gradient-to-b from-[#FDFCF7] to-background py-20 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-4xl mx-auto">
        <ScrollReveal animation="up">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-secondary font-medium text-sm tracking-[0.14em]">
                Bilona cow ghee
              </span>
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-4xl font-bold text-text-primary">Two sizes to choose from</h2>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {isError ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">Failed to load products.</p>
            <button onClick={() => refetch()} className="text-secondary underline font-medium">
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => <ProductSkeleton key={i} />)
              : products?.map((product, i) => (
                  <ScrollReveal key={product.id} animation="up" delay={i * 100}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
          </div>
        )}

        <ScrollReveal animation="up" delay={200}>
          <div className="text-center">
            <Button
              href="/products"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Jars & pricing
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
