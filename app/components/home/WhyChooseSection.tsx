import Image from 'next/image'
import ScrollReveal from '@/app/components/ScrollReveal'

interface Feature {
  iconSrc: string
  iconAlt: string
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    iconSrc: '/aavya/icons/leaf-green.svg',
    iconAlt: 'Farm fresh',
    title: 'Farm Fresh',
    description:
      'Sourced directly from trusted farms where quality and care begin at the very source.',
  },
  {
    iconSrc: '/aavya/icons/camical-green.svg',
    iconAlt: 'Traditional Bilona method',
    title: 'Traditional Method',
    description:
      'Crafted using the time-honoured Bilona process for authentic taste and nutrition.',
  },
  {
    iconSrc: '/aavya/icons/trust-asset-3.svg',
    iconAlt: 'No preservatives',
    title: 'No Preservatives',
    description:
      'Made without any additives or chemicals, just pure, natural goodness.',
  },
  {
    iconSrc: '/aavya/icons/trust-asset-2.svg',
    iconAlt: '100% pure and desi',
    title: '100% Pure & Desi',
    description:
      'Rich, aromatic, and unadulterated ghee you can trust for your everyday meals.',
  },
]

export default function WhyChooseSection() {
  return (
    <section className="relative bg-[#F9F7F0] py-28 px-4 overflow-hidden md:py-32 lg:py-36">
      {/* Blend into sections above (BestSellers) and below (Certifications) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-28 bg-gradient-to-b from-background via-background/40 to-transparent sm:h-36" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-background via-background/40 to-transparent sm:h-36" />

      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary/8 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[280px] rounded-full bg-primary/[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal animation="up">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-4xl font-bold text-text-primary">
              Why Choose Aavya Ghee?
            </h2>
            <div className="w-16 h-1 bg-gradient-green rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {FEATURES.map(({ iconSrc, iconAlt, title, description }, i) => (
            <ScrollReveal key={title} animation="up" delay={i * 110}>
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <Image
                    src={iconSrc}
                    alt={iconAlt}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-contain transition-transform duration-300 group-hover:scale-105"
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
