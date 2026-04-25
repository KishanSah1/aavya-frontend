'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/app/components/ui/Button'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalPrice = useCartStore((s) => s.totalPrice())

  const empty = items.length === 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">Your cart</h1>
        <p className="text-text-secondary text-sm mb-10">
          Review items before checkout. Shipping and taxes are calculated at the next step.
        </p>

        {empty ? (
          <div className="rounded-3xl border border-dashed border-secondary/25 bg-surface/80 px-8 py-16 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-secondary/40 mb-4" aria-hidden />
            <p className="text-text-primary font-semibold mb-1">Your cart is empty</p>
            <p className="text-text-secondary text-sm mb-6">Add ghee from our shop to get started.</p>
            <Button href="/products" size="lg">
              Browse products
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-surface shadow-sm"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-surface">
                    <Image
                      src={item.imageSrc}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <Link
                        href={item.href}
                        className="font-bold text-text-primary hover:text-secondary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-text-secondary">{item.weight}</p>
                      <p className="text-lg font-extrabold text-secondary mt-1 tabular-nums">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1 bg-secondary/5 border border-secondary/20 rounded-full px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-9 h-9 rounded-full bg-secondary/10 hover:bg-secondary/20 text-secondary flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-8 text-center tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-9 h-9 rounded-full bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-full text-text-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="rounded-2xl bg-surface border border-surface p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-text-secondary">Subtotal</p>
                <p className="text-2xl font-extrabold text-text-primary tabular-nums">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </p>
              </div>
              <Button href="/checkout" size="lg">
                Proceed to checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
