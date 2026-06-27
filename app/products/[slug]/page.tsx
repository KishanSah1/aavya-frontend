import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ProductDetail } from '@/lib/types'
import ProductDetailClient from './ProductDetailClient'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

type Props = { params: Promise<{ slug: string }> }

async function fetchProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API}/api/v1/products/${slug}`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    const { data: p } = await res.json()
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      weight: p.weight,
      price: p.price / 100,
      mrp: p.mrp / 100,
      imageSrc: p.imageSrc,
      images: p.images?.length ? p.images : [p.imageSrc],
      href: `/products/${p.slug}`,
      badge: p.badge ?? undefined,
      description: p.description ?? undefined,
      highlights: p.highlights ?? [],
      detailParagraphs: p.detailParagraphs ?? [],
    }
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API}/api/v1/products`)
    if (!res.ok) return []
    const { data } = await res.json()
    return (data as { slug: string }[]).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await fetchProduct(slug)
  if (!product) return { title: 'Product | Aavya Foods' }
  const title = `${product.name} ${product.weight} | Aavya Foods`
  const description =
    product.description ?? `Pure Bilona Cow Ghee — ${product.weight}. Hand-churned tradition, farm-fresh purity.`
  return { title, description, openGraph: { title, description } }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await fetchProduct(slug)
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailClient product={product} />
    </div>
  )
}
