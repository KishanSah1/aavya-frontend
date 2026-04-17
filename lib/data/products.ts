import type { Product, ProductDetail } from '@/lib/types'

const GALLERY_A = [
  '/aavya/product.jpeg',
] as const

const GALLERY_B = [
  '/aavya/product.jpeg',
] as const

const DETAIL_PARAGRAPHS_COMMON = [
  'Our ghee is prepared in small batches using the time-honoured bilona method: curd is hand-churned in a clay pot until butter separates, then slow-cooked over a gentle flame until the milk solids caramelise into that unmistakable nutty aroma.',
  'We source milk only from indigenous desi cows raised on natural feed. Nothing is rushed — no chemical shortcuts, no artificial colours or preservatives — so what reaches your kitchen is exactly what tradition intended: pure, golden, and full of natural fat-soluble vitamins.',
] as const

const HIGHLIGHTS_COMMON = [
  'Made from 100% pure A2 desi cow milk',
  'Traditional bilona (hand-churned) process',
  'No additives, preservatives or artificial flavours',
  'Rich in vitamins A, D, E & K',
] as const

const PRODUCT_DETAILS: ProductDetail[] = [
  {
    id: 'ghee-500ml',
    slug: 'a2-bilona-ghee-500ml',
    name: 'A2 Bilona Cow Ghee',
    weight: '500 ml',
    price: 599,
    mrp: 699,
    imageSrc: GALLERY_A[0],
    images: [...GALLERY_A],
    href: '/products/a2-bilona-ghee-500ml',
    badge: 'Best Seller',
    description:
      'Perfect for daily cooking — pure, aromatic ghee made the traditional way, ideal for every Indian kitchen.',
    highlights: [...HIGHLIGHTS_COMMON],
    detailParagraphs: [
      ...DETAIL_PARAGRAPHS_COMMON,
      'The 500 ml jar is ideal for smaller households or first-time buyers who want to experience authentic bilona ghee without committing to a large pack.',
    ],
  },
  {
    id: 'ghee-1l',
    slug: 'a2-bilona-ghee-1l',
    name: 'A2 Bilona Cow Ghee',
    weight: '1 L',
    price: 1099,
    mrp: 1299,
    imageSrc: GALLERY_B[0],
    images: [...GALLERY_B],
    href: '/products/a2-bilona-ghee-1l',
    badge: 'Value Pack',
    description:
      'Our most-loved family size — stock up and enjoy the goodness of pure ghee every single day without running out.',
    highlights: [...HIGHLIGHTS_COMMON],
    detailParagraphs: [
      ...DETAIL_PARAGRAPHS_COMMON,
      'Choose the 1 litre jar for everyday family meals — one jar goes a long way for rotis, tadkas, sweets, and festive cooking.',
    ],
  },
]

export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return PRODUCT_DETAILS.find((p) => p.slug === slug)
}

export function getAllProductSlugs(): string[] {
  return PRODUCT_DETAILS.map((p) => p.slug)
}

/** List cards + cart — same objects, list view only needs `Product` fields */
export function getProductsForListing(): Product[] {
  return PRODUCT_DETAILS.map(
    ({ slug: _slug, images: _images, mrp: _mrp, detailParagraphs: _dp, ...product }) => product,
  )
}
