'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, ChevronRight, ShoppingBag, MapPin, Clock } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'
import { useAuthStore } from '@/lib/store/authStore'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface OrderItem {
  id: string
  quantity: number
  priceAtPurchase: number
  product: { name: string; slug: string; images: string[] }
}

interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shippingFee: number
  createdAt: string
  shipName: string
  shipCity: string
  shipState: string
  shipPincode: string
  items: OrderItem[]
}

const STATUS_CONFIG: Record<Order['status'], { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', color: 'bg-green-50 text-green-700 border-green-200' },
  shipped:   { label: 'Shipped',   color: 'bg-blue-50 text-blue-700 border-blue-200' },
  delivered: { label: 'Delivered', color: 'bg-secondary/10 text-secondary border-secondary/20' },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-600 border-red-200' },
}

function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function OrdersPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { router.replace('/'); return }
    fetchWithAuth(`${API}/api/v1/orders`)
      .then((r) => r.json())
      .then(({ data }) => setOrders(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user, router])

  return (
    <div className="min-h-screen bg-[#FDFCF7]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-16">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary leading-tight">My Orders</h1>
            <p className="text-text-secondary text-sm">Your complete order history</p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-surface p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-surface rounded w-32" />
                  <div className="h-5 bg-surface rounded-full w-20" />
                </div>
                <div className="h-3 bg-surface rounded w-48 mb-3" />
                <div className="flex gap-3">
                  <div className="w-14 h-14 bg-surface rounded-xl" />
                  <div className="w-14 h-14 bg-surface rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="w-9 h-9 text-text-secondary/40" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">No orders yet</h2>
            <p className="text-text-secondary text-sm mb-6">Your orders will appear here once you make a purchase.</p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-secondary text-white font-semibold px-6 py-3 rounded-full hover:bg-secondary-light transition-colors text-sm"
            >
              Shop Now
            </Link>
          </div>
        )}

        {/* Order list */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending
              const isExpanded = expanded === order.id
              const previewItems = order.items.slice(0, 3)
              const extraCount = order.items.length - previewItems.length

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-surface shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                >
                  {/* Order header */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-text-secondary/60 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary/50 font-mono truncate">#{order.id.slice(0, 16)}…</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-bold text-text-primary text-base">{formatPrice(order.total)}</span>
                      <ChevronRight className={`w-4 h-4 text-text-secondary/40 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </button>

                  {/* Item thumbnails (always visible) */}
                  <div className="px-5 pb-4 flex items-center gap-2">
                    {previewItems.map((item) => (
                      <div key={item.id} className="relative w-14 h-14 rounded-xl overflow-hidden border border-surface bg-surface shrink-0">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-text-secondary/30" />
                          </div>
                        )}
                        {item.quantity > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[9px] font-bold px-1 rounded">
                            ×{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {extraCount > 0 && (
                      <div className="w-14 h-14 rounded-xl border border-surface bg-surface flex items-center justify-center shrink-0">
                        <span className="text-xs font-semibold text-text-secondary/60">+{extraCount}</span>
                      </div>
                    )}
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-surface px-5 py-4 space-y-4">

                      {/* Items */}
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-surface bg-surface shrink-0">
                              {item.product.images?.[0] ? (
                                <Image
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="w-4 h-4 text-text-secondary/30" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text-primary truncate">{item.product.name}</p>
                              <p className="text-xs text-text-secondary/60">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-text-primary shrink-0">
                              {formatPrice(item.priceAtPurchase * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Price breakdown */}
                      <div className="bg-[#FDFCF0] rounded-xl p-4 space-y-2">
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>Subtotal</span>
                          <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-text-secondary">
                          <span>Shipping</span>
                          <span className="text-secondary font-medium">{order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-text-primary border-t border-surface pt-2 mt-1">
                          <span>Total</span>
                          <span>{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Shipping address */}
                      <div className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-text-primary text-xs mb-0.5">Deliver to</p>
                          <p className="text-xs leading-relaxed">
                            {order.shipName} · {order.shipCity}, {order.shipState} {order.shipPincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
