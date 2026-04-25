import Button from '@/app/components/ui/Button'

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">Order Placed!</h1>
        <p className="text-text-secondary mb-8">
          Thank you for your order. We'll start preparing your ghee and update you once it's shipped.
        </p>
        <Button href="/products" size="lg">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
