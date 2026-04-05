'use client'

import { Quote } from 'lucide-react'
import { useTestimonials } from '@/lib/queries/useTestimonials'
import TestimonialCard from './TestimonialCard'

function TestimonialSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-6 animate-pulse flex flex-col gap-4">
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
        <div className="w-10 h-10 rounded-full bg-text-primary/10" />
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

  return (
    <section className="bg-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-3">
            <Quote className="w-8 h-8 text-primary/40" />
          </div>
          <h2 className="text-4xl font-bold text-text-primary">
            Customer Testimonials
          </h2>
          <p className="text-text-secondary mt-3 text-sm">
            Real experiences from families who made the switch to pure ghee.
          </p>
          <div className="w-16 h-1 bg-primary rounded-full mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <TestimonialSkeleton key={i} />
              ))
            : testimonials?.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
        </div>
      </div>
    </section>
  )
}
