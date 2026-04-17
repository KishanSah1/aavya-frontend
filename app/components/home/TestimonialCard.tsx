import { Star } from 'lucide-react'
import type { Testimonial } from '@/lib/types'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const { quote, authorName, authorLocation, rating, avatarInitials } =
    testimonial

  return (
    <article className="h-full bg-surface rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 border border-surface hover:border-primary/20">
      {/* Stars */}
      <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-primary fill-primary'
                : 'text-text-secondary/30'
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-text-secondary text-sm leading-relaxed italic flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-background">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">{avatarInitials}</span>
        </div>
        <div>
          <p className="font-semibold text-text-primary text-sm">
            {authorName}
          </p>
          <p className="text-text-secondary text-xs">{authorLocation}</p>
        </div>
      </div>
    </article>
  )
}
