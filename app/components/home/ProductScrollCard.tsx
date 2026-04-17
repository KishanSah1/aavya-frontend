import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '@/lib/types'
import Button from '@/app/components/ui/Button'

interface ProductScrollCardProps {
  product: Product
}

export default function ProductScrollCard({ product }: ProductScrollCardProps) {
  const { name, weight, price, imageSrc, href, badge } = product

  return (
    <article className="group flex-shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-surface transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image */}
      <div className="relative w-full h-48 bg-surface overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${name} ${weight}`}
          fill
          sizes="208px"
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-500"
        />
        {badge && (
          <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-primary-dark to-primary text-text-primary text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="font-bold text-text-primary text-sm leading-snug">{name}</h3>
          <p className="text-text-secondary text-xs mt-0.5">{weight}</p>
        </div>

        <p className="text-primary font-bold text-lg mt-auto">
          ₹{price.toLocaleString('en-IN')}
        </p>

        <div className="flex gap-2 mt-1">
          <Button
            href={href}
            variant="subtle"
            size="sm"
            className="flex-1 justify-center text-xs"
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex-1 justify-center text-xs"
            leftIcon={<ShoppingCart className="w-3 h-3" />}
            aria-label={`Add ${name} ${weight} to cart`}
          >
            Add
          </Button>
        </div>
      </div>
    </article>
  )
}
