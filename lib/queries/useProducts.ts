import { useQuery } from '@tanstack/react-query'
import type { Product } from '@/lib/types'

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ghee-250g',
    name: 'Cow Ghee',
    weight: '250g',
    price: 349,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-250g',
    badge: 'Starter Pack',
  },
  {
    id: 'ghee-500g',
    name: 'Cow Ghee',
    weight: '500g',
    price: 599,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-500g',
    badge: 'Best Seller',
  },
  {
    id: 'ghee-1kg',
    name: 'Cow Ghee',
    weight: '1 kg',
    price: 1149,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-1kg',
    badge: 'Value Pack',
  },
  {
    id: 'ghee-2kg',
    name: 'Cow Ghee',
    weight: '2 kg',
    price: 2199,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-2kg',
    badge: 'Family Pack',
  },
  {
    id: 'ghee-5kg',
    name: 'Cow Ghee',
    weight: '5 kg',
    price: 4999,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-5kg',
    badge: 'Bulk Order',
  },
  {
    id: 'ghee-glass-500g',
    name: 'Cow Ghee — Glass Jar',
    weight: '500g',
    price: 649,
    imageSrc: '/aavya/product.jpeg',
    href: '/products/cow-ghee-glass-500g',
  },
]

// Simulates async API call — swap URL string for real endpoint later
async function fetchProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 400)) // simulate network latency
  return MOCK_PRODUCTS
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
  })
}
