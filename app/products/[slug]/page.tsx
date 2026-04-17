import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProductSlugs, getProductDetailBySlug } from '@/lib/data/products'
import ProductDetailClient from './ProductDetailClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductDetailBySlug(slug)
  if (!product) {
    return { title: 'Product | Aavya Foods' }
  }
  const title = `${product.name} ${product.weight} | Aavya Foods`
  const description =
    product.description ??
    `Pure A2 Bilona Cow Ghee — ${product.weight}. Hand-churned tradition, farm-fresh purity.`
  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductDetailBySlug(slug)
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-background">
      <ProductDetailClient product={product} />
    </div>
  )
}
