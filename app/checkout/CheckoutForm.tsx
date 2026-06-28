'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
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

interface AppliedCoupon {
  code: string
  discountPaise: number
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayFailedResponse {
  error?: { description?: string }
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: RazorpayFailedResponse) => void) => void
    }
  }
}

const EMPTY: Address = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' }

const PHONE_RE = /^[6-9]\d{9}$/
const PINCODE_RE = /^\d{6}$/

function loadRazorpayScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}

function validateAddress(address: Address): string | null {
  if (!PHONE_RE.test(address.phone)) return 'Enter a valid 10-digit mobile number starting with 6–9.'
  if (!PINCODE_RE.test(address.pincode)) return 'Enter a valid 6-digit pincode.'
  return null
}

function formatInr(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

export default function CheckoutForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const items = useCartStore((s) => s.items)
  const totalPrice = useCartStore((s) => s.totalPrice())
  const clearCart = useCartStore((s) => s.clearCart)
  const accessToken = useAuthStore((s) => s.accessToken)
  const openModal = useAuthStore((s) => s.openModal)

  const subtotalPaise = useMemo(() => Math.round(totalPrice * 100), [totalPrice])

  const [address, setAddress] = useState<Address>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [coinBalance, setCoinBalance] = useState(0)
  const [coinsToUse, setCoinsToUse] = useState(0)
  const [useMaxCoins, setUseMaxCoins] = useState(false)

  const afterCouponPaise = Math.max(0, subtotalPaise - (appliedCoupon?.discountPaise ?? 0))
  const maxCoinsApplicable = Math.min(coinBalance, Math.floor(afterCouponPaise / 100))
  const effectiveCoins = useMaxCoins ? maxCoinsApplicable : Math.min(coinsToUse, maxCoinsApplicable)
  const coinDiscountPaise = effectiveCoins * 100
  const finalTotalPaise = Math.max(100, subtotalPaise - (appliedCoupon?.discountPaise ?? 0) - coinDiscountPaise)

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items.length, router])

  useEffect(() => {
    const couponFromUrl = searchParams.get('coupon')
    if (couponFromUrl && !appliedCoupon && subtotalPaise > 0) {
      setCouponInput(couponFromUrl.toUpperCase())
      void applyCoupon(couponFromUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, subtotalPaise])

  useEffect(() => {
    if (!accessToken) {
      setCoinBalance(0)
      setCoinsToUse(0)
      return
    }
    fetchWithAuth(`${API}/api/v1/wallet`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data?.coinBalance != null) setCoinBalance(data.coinBalance)
      })
      .catch(() => {})
  }, [accessToken])

  useEffect(() => {
    if (useMaxCoins) setCoinsToUse(maxCoinsApplicable)
  }, [useMaxCoins, maxCoinsApplicable])

  if (items.length === 0) return null

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function applyCoupon(codeOverride?: string) {
    const code = (codeOverride ?? couponInput).trim()
    if (!code) return

    setCouponLoading(true)
    setCouponError(null)

    try {
      const res = await fetch(`${API}/api/v1/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: subtotalPaise }),
      })
      const json = await res.json()
      if (!res.ok) {
        setCouponError(json.error?.message ?? 'Invalid coupon')
        setAppliedCoupon(null)
        return
      }
      setAppliedCoupon({ code: json.data.couponCode ?? code.toUpperCase(), discountPaise: json.data.discount })
      setCouponInput(json.data.couponCode ?? code.toUpperCase())
    } catch {
      setCouponError('Could not validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const validationError = validateAddress(address)
    if (validationError) {
      setError(validationError)
      return
    }

    if (effectiveCoins > 0 && !accessToken) {
      openModal()
      setError('Please log in to use Aavya coins.')
      return
    }

    setLoading(true)

    try {
      const body: Record<string, unknown> = {
        items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        shippingAddress: address,
      }
      if (appliedCoupon) body.couponCode = appliedCoupon.code
      if (effectiveCoins > 0) body.coinsToUse = effectiveCoins

      const res = await fetchWithAuth(`${API}/api/v1/orders/initiate`, {
        method: 'POST',
        body: JSON.stringify(body),
      })

      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? 'Something went wrong')
        setLoading(false)
        return
      }

      const { razorpayOrderId, amount, currency = 'INR' } = json.data

      await loadRazorpayScript()

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: 'Aavya Foods',
        description: 'Pure Bilona Ghee',
        handler: async (response: RazorpayResponse) => {
          try {
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
            } else {
              const confirmJson = await confirmRes.json()
              setError(
                confirmJson.error?.message ??
                  `Payment received but order confirmation failed. Contact support with payment ID: ${response.razorpay_payment_id}`
              )
            }
          } catch {
            setError(
              `Payment received but order confirmation failed. Contact support with payment ID: ${response.razorpay_payment_id}`
            )
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled.')
          },
        },
        prefill: { name: address.name, contact: address.phone },
        theme: { color: '#D4A853' },
      })

      rzp.on('payment.failed', (response) => {
        setLoading(false)
        setError(response.error?.description ?? 'Payment failed. Please try again.')
      })

      rzp.open()
    } catch {
      setError('Network error. Please try again.')
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

        <div className="rounded-2xl bg-surface border border-surface p-5 mb-6">
          <h2 className="font-bold text-text-primary mb-3">Order Summary</h2>
          <ul className="flex flex-col gap-2 mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm text-text-secondary">
                <span>{item.name} ({item.weight}) × {item.quantity}</span>
                <span className="font-semibold text-text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-surface pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>{formatInr(subtotalPaise)}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-700">
                <span>Coupon ({appliedCoupon.code})</span>
                <span>−{formatInr(appliedCoupon.discountPaise)}</span>
              </div>
            )}
            {effectiveCoins > 0 && (
              <div className="flex justify-between text-secondary">
                <span>Coins ({effectiveCoins})</span>
                <span>−{formatInr(coinDiscountPaise)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-text-primary pt-2 border-t border-surface">
              <span>Total</span>
              <span>{formatInr(finalTotalPaise)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-surface p-5 mb-6 space-y-4">
          <h2 className="font-bold text-text-primary">Coupon code</h2>
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 border border-surface rounded-xl px-4 py-2.5 text-sm uppercase"
            />
            <button
              type="button"
              onClick={() => applyCoupon()}
              disabled={couponLoading || !couponInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold disabled:opacity-50"
            >
              {couponLoading ? '…' : 'Apply'}
            </button>
          </div>
          {appliedCoupon && (
            <button
              type="button"
              onClick={() => { setAppliedCoupon(null); setCouponInput('') }}
              className="text-xs text-text-secondary underline"
            >
              Remove coupon
            </button>
          )}
          {couponError && <p className="text-red-600 text-sm">{couponError}</p>}
        </div>

        <div className="rounded-2xl bg-white border border-surface p-5 mb-8 space-y-3">
          <h2 className="font-bold text-text-primary">Aavya coins</h2>
          {accessToken ? (
            <>
              <p className="text-sm text-text-secondary">
                Available balance: <span className="font-semibold text-secondary">{coinBalance} coins</span> (1 coin = ₹1)
              </p>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  min={0}
                  max={maxCoinsApplicable}
                  value={useMaxCoins ? maxCoinsApplicable : coinsToUse}
                  onChange={(e) => {
                    setUseMaxCoins(false)
                    setCoinsToUse(Math.max(0, Number(e.target.value) || 0))
                  }}
                  disabled={useMaxCoins || maxCoinsApplicable === 0}
                  className="w-28 border border-surface rounded-xl px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={useMaxCoins}
                    onChange={(e) => setUseMaxCoins(e.target.checked)}
                    disabled={maxCoinsApplicable === 0}
                  />
                  Use maximum ({maxCoinsApplicable})
                </label>
              </div>
            </>
          ) : (
            <p className="text-sm text-text-secondary">
              <button type="button" onClick={openModal} className="text-secondary font-semibold underline">
                Log in
              </button>{' '}
              to use your Aavya coins at checkout.
            </p>
          )}
        </div>

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
            {loading ? 'Processing…' : `Pay ${formatInr(finalTotalPaise)}`}
          </Button>
        </form>
      </div>
    </div>
  )
}
