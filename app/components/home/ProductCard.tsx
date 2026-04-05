import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, weight, price, imageSrc, href, badge } = product

  return (
    <article className="bg-surface rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group">
      {/* Image */}
      <div className="relative aspect-square bg-background overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${name} ${weight}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-3 left-3 bg-primary text-text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-text-primary text-lg leading-tight">
            {name}
          </h3>
          <p className="text-text-secondary text-sm">{weight}</p>
        </div>

        <p className="text-primary font-bold text-2xl mt-auto">
          ₹{price.toLocaleString('en-IN')}
        </p>

        <Link
          href={href}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-green text-background hover:opacity-90 font-semibold text-sm px-5 py-2.5 rounded-full transition-all shadow-sm group/btn"
        >
          Know More
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
