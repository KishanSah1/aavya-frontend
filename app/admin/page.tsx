'use client'

import { useEffect, useState } from 'react'
import { Package, Tag, Ticket, ShoppingBag } from 'lucide-react'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface Stats {
  products: number
  categories: number
  coupons: number
  orders: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const [products, categories, coupons, orders] = await Promise.all([
        fetchWithAuth(`${API}/api/v1/products`).then((r) => r.json()),
        fetchWithAuth(`${API}/api/v1/categories`).then((r) => r.json()),
        fetchWithAuth(`${API}/api/v1/coupons`).then((r) => r.json()),
        fetchWithAuth(`${API}/api/v1/orders`).then((r) => r.json()),
      ])
      setStats({
        products: products.data?.length ?? 0,
        categories: categories.data?.length ?? 0,
        coupons: coupons.data?.filter((c: any) => c.isActive).length ?? 0,
        orders: orders.data?.length ?? 0,
      })
    }
    load()
  }, [])

  const cards = [
    { label: 'Products', value: stats?.products, icon: Package, color: 'bg-secondary/10 text-secondary' },
    { label: 'Categories', value: stats?.categories, icon: Tag, color: 'bg-primary/10 text-primary' },
    { label: 'Active Coupons', value: stats?.coupons, icon: Ticket, color: 'bg-green-50 text-green-700' },
    { label: 'Orders', value: stats?.orders, icon: ShoppingBag, color: 'bg-orange-50 text-orange-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-surface p-6 flex items-center gap-4 shadow-sm">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{value ?? '—'}</p>
              <p className="text-xs text-text-secondary">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
