export interface Comment {
  id: number
  author: string
  initials: string
  text: string
  time: string
}

export interface Post {
  id: number
  title: string
  caption: string
  date: string
  image: string
  images: string[]
  featured: boolean
  author: string
  initials: string
  likes: number
  comments: Comment[]
}
