import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API}/api/v1/products`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const { data } = await res.json()
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    weight: p.weight,
    price: p.price / 100,
    mrp: p.mrp / 100,
    imageSrc: p.imageSrc,
    href: `/products/${p.slug}`,
    badge: p.badge,
    description: p.description,
    highlights: p.highlights,
  }))
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  })
}
