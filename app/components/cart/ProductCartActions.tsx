'use client'

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Minus, Plus, ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/app/components/ui/Button'

export type ProductCartActionsHandle = {
  addToCart: () => void
}

type Props = {
  product: Product
  variant?: 'grid' | 'detail'
}

function QtyStepper({
  value,
  onDecrease,
  onIncrease,
  size = 'md',
}: {
  value: number
  onDecrease: () => void
  onIncrease: () => void
  size?: 'sm' | 'md'
}) {
  const btnClass =
    size === 'sm'
      ? 'w-9 h-9 rounded-full flex items-center justify-center transition-colors'
      : 'w-11 h-11 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary'

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-secondary/5 border border-secondary/20 rounded-full ${
        size === 'sm' ? 'px-2 py-1.5' : 'px-2 py-2'
      }`}
      role="group"
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={`${btnClass} bg-secondary/10 hover:bg-secondary/20 text-secondary`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span
        className={`font-bold text-text-primary tabular-nums text-center ${
          size === 'sm' ? 'w-10 text-base' : 'w-12 text-lg'
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`${btnClass} bg-secondary text-white hover:bg-secondary/90`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  )
}

const ProductCartActions = forwardRef<ProductCartActionsHandle, Props>(function ProductCartActions(
  { product, variant = 'grid' },
  ref
) {
  const router = useRouter()
  const hasHydrated = useCartStore((s) => s._hasHydrated)
  const addItem = useCartStore((s) => s.addItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const cartItem = useCartStore((s) =>
    hasHydrated ? s.items.find((i) => i.id === product.id) : undefined
  )

  const [desiredQty, setDesiredQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addToCart = useCallback(() => {
    if (cartItem) {
      updateQty(product.id, cartItem.quantity)
      return
    }
    addItem(product)
    if (desiredQty > 1) updateQty(product.id, desiredQty)
    setJustAdded(true)
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    addedTimerRef.current = setTimeout(() => setJustAdded(false), 2000)
  }, [cartItem, addItem, updateQty, product, desiredQty])

  useImperativeHandle(ref, () => ({ addToCart }), [addToCart])

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    }
  }, [])

  const handleBuyNow = () => {
    addToCart()
    router.push('/cart')
  }

  const isDetail = variant === 'detail'
  const stepperSize = isDetail ? 'md' : 'sm'

  // Mode B — in cart
  if (cartItem) {
    if (isDetail) {
      return (
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-sm font-semibold text-text-primary mb-3">Quantity in cart</p>
            <QtyStepper
              size={stepperSize}
              value={cartItem.quantity}
              onDecrease={() => updateQty(product.id, cartItem.quantity - 1)}
              onIncrease={() => updateQty(product.id, Math.min(99, cartItem.quantity + 1))}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/cart" variant="outline" size="lg" fullWidth leftIcon={<ShoppingCart className="w-4 h-4" />}>
              View Cart
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
        </div>
      )
    }

    return (
      <div className="w-full flex justify-center bg-secondary/5 border border-secondary/20 rounded-full px-2 py-1.5">
        <QtyStepper
          size={stepperSize}
          value={cartItem.quantity}
          onDecrease={() => updateQty(product.id, cartItem.quantity - 1)}
          onIncrease={() => updateQty(product.id, Math.min(99, cartItem.quantity + 1))}
        />
      </div>
    )
  }

  // Mode A — not in cart
  if (isDetail) {
    return (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-sm font-semibold text-text-primary mb-3" id={`qty-label-${product.id}`}>
            Quantity
          </p>
          <QtyStepper
            size={stepperSize}
            value={desiredQty}
            onDecrease={() => setDesiredQty((q) => Math.max(1, q - 1))}
            onIncrease={() => setDesiredQty((q) => Math.min(99, q + 1))}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            onClick={addToCart}
            leftIcon={<ShoppingCart className="w-4 h-4" />}
          >
            {justAdded ? 'Added to cart!' : 'Add to Cart'}
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
      </div>
    )
  }

  return (
    <Button variant="primary" fullWidth onClick={addToCart} leftIcon={<ShoppingCart className="w-4 h-4" />}>
      {justAdded ? 'Added!' : 'Add to Cart'}
    </Button>
  )
})

export default ProductCartActions
