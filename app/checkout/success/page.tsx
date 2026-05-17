import Button from '@/app/components/ui/Button'
import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✓</span>
        </div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">Order Placed!</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          Thank you for your order. We'll start preparing your ghee and update you once it's shipped.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/products" size="lg">
            Continue Shopping
          </Button>
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 border border-secondary text-secondary font-semibold px-6 py-3 rounded-full hover:bg-secondary/5 transition-colors text-sm"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  )
}
