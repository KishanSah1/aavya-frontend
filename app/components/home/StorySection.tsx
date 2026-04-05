import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
            From Our Farm
            <br />
            <span className="text-gradient-green">to Your Home</span>
          </h2>

          <p className="text-text-secondary leading-relaxed mb-4 text-base md:text-lg">
            Our ghee is made from the milk of free-roaming indigenous Desi cows
            that graze on natural pastures. We follow the ancient Bilona method
            — churning curd by hand to separate the butter, then slow-cooking it
            into golden, aromatic ghee.
          </p>
          <p className="text-text-secondary/80 leading-relaxed mb-8 text-sm md:text-base">
            No factory shortcuts. No artificial inputs. Just generations of
            wisdom and a deep love for purity.
          </p>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-gradient-green text-background font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-all shadow-md group"
          >
            Know More
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
