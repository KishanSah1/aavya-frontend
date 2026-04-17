export interface Product {
  id: string
  name: string
  weight: string
  price: number
  imageSrc: string
  href: string
  badge?: string
  description?: string
  highlights?: string[]
}

/** Full product record for PDP — extends list card data with gallery & story copy */
export interface ProductDetail extends Product {
  slug: string
  images: string[]
  /** Original list price when on sale (shown struck through) */
  mrp?: number
  detailParagraphs: string[]
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
