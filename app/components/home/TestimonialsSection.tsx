'use client'

import { Quote } from 'lucide-react'
import { useTestimonials } from '@/lib/queries/useTestimonials'
import TestimonialCard from './TestimonialCard'
import ScrollReveal from '@/app/components/ScrollReveal'

function TestimonialSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-6 animate-pulse flex flex-col gap-4 w-72 shrink-0">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-4 h-4 bg-text-primary/10 rounded-full" />
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-text-primary/10 rounded w-full" />
        <div className="h-3 bg-text-primary/10 rounded w-5/6" />
        <div className="h-3 bg-text-primary/10 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-3 pt-2 border-t border-background">
        <div className="w-10 h-10 rounded-full bg-text-primary/10 shrink-0" />
        <div className="space-y-1.5">
          <div className="h-3 bg-text-primary/10 rounded w-24" />
          <div className="h-2 bg-text-primary/10 rounded w-16" />
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useTestimonials()
  const doubled = testimonials ? [...testimonials, ...testimonials] : []

  return (
    <section className="relative bg-background py-20 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4">
        <ScrollReveal animation="up">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-3">
              <Quote className="w-8 h-8 text-primary/40" />
            </div>
            <h2 className="text-4xl font-bold text-text-primary">
              Straight from Our Customers
            </h2>
            <p className="text-text-secondary mt-3 text-sm">
              Real experiences from families who made the switch to pure ghee.
            </p>
            <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>
        </div>

      {/* Full-bleed marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {isLoading ? (
          <div className="flex gap-6 px-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div
            className="flex gap-6 animate-marquee py-2"
            style={{ width: 'max-content' }}
          >
            {doubled.map((t, i) => (
              <div key={`${t.id}-${i}`} className="w-72 shrink-0">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
