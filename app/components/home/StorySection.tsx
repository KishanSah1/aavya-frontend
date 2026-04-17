import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import Button from '@/app/components/ui/Button'

export default function StorySection() {
  return (
    <section className="relative min-h-[500px] md:min-h-[560px] overflow-hidden flex items-center">
      {/* Background image */}
      <Image
        src="/aavya/farm-story.png"
        alt="Aavya farm"
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />

      {/* Content */}
      <div className="relative z-10 w-full py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-gradient-green" />
            <span className="text-gradient-green font-medium text-sm uppercase tracking-widest">
              Our Journey
            </span>
            <div className="h-px w-12 bg-gradient-green" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            Ever Wonder What Real
            <br />
            <span className="text-gradient-green">Ghee Feels Like?</span>
          </h2>

          <p className="text-text-secondary leading-relaxed mb-4 text-base md:text-lg">
            Not factory-made. Not rushed. Born in open farms, crafted with
            patience, just the way our grandparents trusted. Because here,
            nothing is hurried.
          </p>
          <p className="text-text-secondary/70 leading-relaxed mb-8 text-sm md:text-base italic">
            No shortcuts. Just sincerity in every step.
          </p>

          <Button
            href="/journey"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            See How It&apos;s Made
          </Button>
        </div>
      </div>
    </section>
  )
}
