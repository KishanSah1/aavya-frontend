'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/app/components/ui/Button'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface Address {
  name: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

const EMPTY: Address = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice())
  const clearCart = useCartStore((s) => s.clearCart)

  const [address, setAddress] = useState<Address>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    router.replace('/cart')
    return null
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${API}/api/v1/orders/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          shippingAddress: address,
        }),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Something went wrong')
        return
      }

      const { razorpayOrderId, amount } = json.data

      // load Razorpay checkout script
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)

      script.onload = () => {
        const rzp = new (window as any).Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount,
          currency: 'INR',
          order_id: razorpayOrderId,
          name: 'Aavya Foods',
          description: 'A2 Bilona Ghee',
          handler: async (response: any) => {
            const confirmRes = await fetch(`${API}/api/v1/orders/confirm`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            if (confirmRes.ok) {
              clearCart()
              router.push('/checkout/success')
            }
          },
          prefill: { name: address.name, contact: address.phone },
          theme: { color: '#D4A853' },
        })
        rzp.open()
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const field = (label: string, name: keyof Address, placeholder?: string, required = true) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <input
        name={name}
        value={address[name]}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        className="border border-surface rounded-xl px-4 py-2.5 text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30"
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <h1 className="text-3xl font-extrabold text-text-primary mb-2">Checkout</h1>
        <p className="text-text-secondary text-sm mb-8">Enter your delivery address to place the order.</p>

        {/* Order summary */}
        <div className="rounded-2xl bg-surface border border-surface p-5 mb-8">
          <h2 className="font-bold text-text-primary mb-3">Order Summary</h2>
          <ul className="flex flex-col gap-2 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-text-secondary">
                <span>{item.name} ({item.weight}) × {item.quantity}</span>
                <span className="font-semibold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-bold text-text-primary border-t border-surface pt-3">
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Address form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h2 className="font-bold text-text-primary">Delivery Address</h2>
          {field('Full Name', 'name', 'Kishan Shah')}
          {field('Phone Number', 'phone', '9876543210')}
          {field('Address Line 1', 'line1', 'House No / Street')}
          {field('Address Line 2 (optional)', 'line2', 'Area / Landmark', false)}
          <div className="grid grid-cols-2 gap-4">
            {field('City', 'city', 'Ahmedabad')}
            {field('State', 'state', 'Gujarat')}
          </div>
          {field('Pincode', 'pincode', '380001')}

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Processing…' : 'Pay Now'}
          </Button>
        </form>
      </div>
    </div>
  )
}
