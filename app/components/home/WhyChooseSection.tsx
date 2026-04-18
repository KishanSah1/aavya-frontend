import { ShieldCheck, FlaskConical, Heart, Sprout } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Sprout,
    title: 'Farm Fresh',
    description:
      'Sourced directly from trusted farms where quality and care begin at the very source.',
  },
  {
    icon: FlaskConical,
    title: 'Traditional Method',
    description:
      'Crafted using the time-honoured Bilona process for authentic taste and nutrition.',
  },
  {
    icon: Heart,
    title: 'No Preservatives',
    description:
      'Made without any additives or chemicals, just pure, natural goodness.',
  },
  {
    icon: ShieldCheck,
    title: '100% Pure & Desi',
    description:
      'Rich, aromatic, and unadulterated ghee you can trust for your everyday meals.',
  },
]

export default function WhyChooseSection() {
  return (
    <section className="relative bg-surface py-20 px-4 overflow-hidden">
      {/* Decorative ambient blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary/6 blur-3xl pointer-events-none" />

      <svg width={0} height={0} className="absolute" aria-hidden>
        <defs>
          <linearGradient id="why-choose-green-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--secondary-light)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative max-w-5xl mx-auto">
        <ScrollReveal animation="up">
          <div className="text-center mb-14">
            <p className="text-gradient-green font-medium text-sm uppercase tracking-widest mb-2">
              The Aavya Difference
            </p>
            <h2 className="text-4xl font-bold text-text-primary">
              Why Choose Aavya Ghee?
            </h2>
            <div className="w-16 h-1 bg-gradient-green rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <ScrollReveal key={title} animation="up" delay={i * 110}>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-background shadow-sm flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-secondary/12 group-hover:to-secondary-light/12 transition-all duration-300">
                  <Icon
                    className="w-9 h-9 transition-all duration-300 group-hover:scale-110"
                    stroke="url(#why-choose-green-gradient)"
                  />
                </div>
                <h3 className="font-bold text-text-primary text-sm md:text-base mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
