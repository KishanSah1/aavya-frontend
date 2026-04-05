import { useQuery } from '@tanstack/react-query'
import type { Testimonial } from '@/lib/types'

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Aavya ghee has completely changed how my family cooks. The aroma is incredible and you can actually taste the difference from store-bought brands. Pure, rich, and absolutely worth every rupee.',
    authorName: 'Priya Sharma',
    authorLocation: 'Mumbai, Maharashtra',
    rating: 5,
    avatarInitials: 'PS',
  },
  {
    id: 't2',
    quote:
      'Been using this for 6 months now. The Bilona method really makes a difference — the ghee is light, fragrant, and our kids love it. Highly recommend to anyone who values quality.',
    authorName: 'Rajesh Nair',
    authorLocation: 'Bangalore, Karnataka',
    rating: 5,
    avatarInitials: 'RN',
  },
]

async function fetchTestimonials(): Promise<Testimonial[]> {
  await new Promise((r) => setTimeout(r, 300))
  return MOCK_TESTIMONIALS
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    staleTime: 10 * 60 * 1000,
  })
}
