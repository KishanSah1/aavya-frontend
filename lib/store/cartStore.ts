import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/lib/types'
import { fetchWithAuth } from '@/lib/fetchWithAuth'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  resetCart: () => void
  syncOnLogin: () => Promise<void>
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...state.items, { ...product, quantity: 1 }] }
        })
        fetchWithAuth(`${API}/api/v1/cart/items`, {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        }).catch(() => {})
      },

      removeItem: (id) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
        fetchWithAuth(`${API}/api/v1/cart/items/${id}`, { method: 'DELETE' }).catch(() => {})
      },

      updateQty: (id, qty) => {
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        }))
        if (qty <= 0) {
          fetchWithAuth(`${API}/api/v1/cart/items/${id}`, { method: 'DELETE' }).catch(() => {})
        } else {
          fetchWithAuth(`${API}/api/v1/cart/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity: qty }),
          }).catch(() => {})
        }
      },

      clearCart: () => {
        set({ items: [] })
        fetchWithAuth(`${API}/api/v1/cart`, { method: 'DELETE' }).catch(() => {})
      },

      resetCart: () => set({ items: [] }),

      syncOnLogin: async () => {
        const localItems = get().items

        if (localItems.length > 0) {
          await fetchWithAuth(`${API}/api/v1/cart/sync`, {
            method: 'POST',
            body: JSON.stringify({
              items: localItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
            }),
          }).catch(() => {})
        }

        const res = await fetchWithAuth(`${API}/api/v1/cart`).catch(() => null)
        if (res?.ok) {
          const { data } = await res.json()
          set({ items: data.items })
        }
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'aavya-cart' }
  )
)
