import { useQuery } from '@tanstack/react-query'
import { getProductsForListing } from '@/lib/data/products'
import type { Product } from '@/lib/types'

// Simulates async API call — swap for real endpoint later
async function fetchProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 400)) // simulate network latency
  return getProductsForListing()
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  })
}
