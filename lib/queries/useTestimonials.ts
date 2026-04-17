import { useQuery } from '@tanstack/react-query'
import type { Testimonial } from '@/lib/types'

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I switched to this ghee recently, and honestly, the aroma itself tells you it\'s pure. Feels like the ghee we used to have at home.',
    authorName: 'Priya Sarkar',
    authorLocation: 'Kolkata, West Bengal',
    rating: 5,
    avatarInitials: 'PS',
  },
  {
    id: 't2',
    quote:
      'You can actually taste the difference. It\'s lighter, richer, and doesn\'t feel processed at all.',
    authorName: 'Rahul Kumar',
    authorLocation: 'Delhi, NCR',
    rating: 5,
    avatarInitials: 'RK',
  },
  {
    id: 't3',
    quote:
      'I was looking for something without preservatives, and this checked all the boxes. Clean, simple, and trustworthy.',
    authorName: 'Neha Chettri',
    authorLocation: 'Pune, Maharashtra',
    rating: 5,
    avatarInitials: 'NC',
  },
  {
    id: 't4',
    quote:
      'The Bilona method really shows. The texture and flavour are completely different from regular store-bought ghee.',
    authorName: 'Amit Raghuvanshi',
    authorLocation: 'Jaipur, Rajasthan',
    rating: 5,
    avatarInitials: 'AR',
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
