export interface Comment {
  id: number
  author: string
  initials: string
  text: string
  time: string
}

export type PostCategory = 'Farm' | 'Process' | 'Seasonal' | 'Team'

export interface Post {
  id: number
  title: string
  excerpt: string
  caption: string
  category: PostCategory
  date: string
  image: string
  images: string[]
  featured: boolean
  author: string
  initials: string
  likes: number
  comments: Comment[]
}
