import { useQuery } from '@tanstack/react-query'
import type { Post } from '@/app/seller/types'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch(`${API}/api/v1/posts`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  const { data } = await res.json()
  return data.map((p: any) => ({
    id: p.id,
    title: p.title,
    caption: p.caption,
    date: formatDate(p.date),
    image: p.image,
    images: p.images,
    featured: p.featured,
    author: p.author,
    initials: p.initials,
    likes: p.likesCount,
    comments: [],
  }))
}

export function usePosts() {
  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000,
  })
}
