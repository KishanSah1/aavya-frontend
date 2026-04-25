import { useQuery } from '@tanstack/react-query'
import type { Testimonial } from '@/lib/types'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

async function fetchTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${API}/api/v1/testimonials`)
  if (!res.ok) throw new Error('Failed to fetch testimonials')
  const { data } = await res.json()
  return data
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    staleTime: 10 * 60 * 1000,
  })
}
