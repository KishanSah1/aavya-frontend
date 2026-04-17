import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/types'
import Button from '@/app/components/ui/Button'

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

        <Button
          href={href}
          size="sm"
          className="mt-2"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Know More
        </Button>
      </div>
    </article>
  )
}
