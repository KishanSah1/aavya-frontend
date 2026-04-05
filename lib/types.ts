export interface Product {
  id: string
  name: string
  weight: string
  price: number
  imageSrc: string
  href: string
  badge?: string
}

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorLocation: string
  rating: number
  avatarInitials: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface NavLink {
  label: string
  href: string
}
