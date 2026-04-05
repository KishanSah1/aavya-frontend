'use client'

import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'
import { useProducts } from '@/lib/queries/useProducts'
import ProductCard from './ProductCard'

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
    <section className="bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-secondary font-medium text-sm uppercase tracking-widest">
              Top Picks
            </span>
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-text-primary">
            Our Bestsellers
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-4" />
        </div>

        {/* Grid */}
        {isError ? (
          <div className="text-center py-12">
            <p className="text-text-secondary mb-4">Failed to load products.</p>
            <button
              onClick={() => refetch()}
              className="text-secondary underline font-medium"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {isLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : products?.slice(0, 2).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-green text-background font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-all hover:scale-105 shadow-md group"
          >
            View All Products
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
