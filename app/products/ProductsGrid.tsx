'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Minus, Plus, ShoppingCart } from 'lucide-react'
import { useProducts } from '@/lib/queries/useProducts'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/app/components/ui/Button'
import type { Product } from '@/lib/types'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md animate-pulse">
      <div className="aspect-square bg-surface" />
      <div className="p-7 flex flex-col gap-4">
        <div className="h-3 bg-surface rounded-full w-1/4" />
        <div className="h-6 bg-surface rounded-full w-2/3" />
        <div className="h-4 bg-surface rounded-full w-full" />
        <div className="h-4 bg-surface rounded-full w-5/6" />
        <div className="flex flex-col gap-2 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 bg-surface rounded-full w-3/4" />
          ))}
        </div>
        <div className="h-12 bg-surface rounded-full mt-4" />
      </div>
    </div>
  )
}

function CartControl({ product }: { product: Product }) {
  const items = useCartStore((s) => s.items)
  const addItem = useCartStore((s) => s.addItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const cartItem = items.find((i) => i.id === product.id)

  if (cartItem) {
    return (
      <div className="flex items-center justify-between bg-secondary/5 border border-secondary/20 rounded-full px-2 py-1.5">
        <button
          onClick={() => updateQty(product.id, cartItem.quantity - 1)}
          className="w-9 h-9 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center justify-center transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="font-bold text-text-primary text-base w-10 text-center tabular-nums">
          {cartItem.quantity}
        </span>
        <button
          onClick={() => updateQty(product.id, cartItem.quantity + 1)}
          className="w-9 h-9 rounded-full bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <Button
      variant="primary"
      fullWidth
      onClick={() => addItem(product)}
      leftIcon={<ShoppingCart className="w-4 h-4" />}
    >
      Add to Cart
    </Button>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { name, weight, price, imageSrc, href, badge, description, highlights } = product

  return (
    <article className="relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group border border-surface cursor-pointer">
      <Link href={href} className="absolute inset-0 z-[1]" aria-label={`View ${name} ${weight}`} />
      {/* Image */}
      <div className="relative aspect-square bg-surface overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${name} ${weight}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-4 left-4 bg-primary text-text-primary text-xs font-bold px-3.5 py-1.5 rounded-full shadow">
            {badge}
          </span>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-text-primary text-sm font-bold px-3.5 py-1.5 rounded-full shadow">
          {weight}
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col gap-5 flex-1">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-secondary font-semibold uppercase tracking-widest mb-1">
              Pure &amp; Natural
            </p>
            <h2 className="text-xl font-bold text-text-primary leading-snug">{name}</h2>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-extrabold text-secondary">
              ₹{price.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-text-secondary mt-0.5">per jar</p>
          </div>
        </div>

        {description && (
          <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
        )}

        {highlights && highlights.length > 0 && (
          <ul className="flex flex-col gap-2">
            {highlights.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <Leaf className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                {point}
              </li>
            ))}
          </ul>
        )}

        {/* Actions */}
        <div className="relative z-10 mt-auto flex flex-col gap-3 pt-2">
          <CartControl product={product} />
          <Button
            href={href}
            variant="secondary"
            fullWidth
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Know More
          </Button>
        </div>
      </div>
    </article>
  )
}

export default function ProductsGrid() {
  const { data: products, isLoading, isError, refetch } = useProducts()

  if (isError) {
    return (
      <div className="text-center py-24">
        <p className="text-text-secondary mb-4">Failed to load products. Please try again.</p>
        <Button variant="ghost" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      {isLoading
        ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
        : products?.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  )
}
