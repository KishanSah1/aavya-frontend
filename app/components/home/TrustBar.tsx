import { Sprout, FlaskConical, ShieldCheck } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'

const TRUST_ITEMS = [
  {
    icon: Sprout,
    title: 'Farm Fresh',
    description:
      'Sourced directly from our free-grazing indigenous cow farms. No middlemen, no compromise.',
  },
  {
    icon: FlaskConical,
    title: 'Bilona Method',
    description:
      'Traditional hand-churned process that preserves all natural nutrients and aroma.',
  },
  {
    icon: ShieldCheck,
    title: '100% Pure',
    description:
      'Zero additives, zero preservatives. Lab tested for purity before every batch.',
  },
]

export default function TrustBar() {
  return (
    <section className="relative bg-background border-y border-primary/10 py-12 px-4 overflow-hidden">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/6 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }, index) => (
          <ScrollReveal key={title} animation="up" delay={index * 130}>
            <div
              className={`flex flex-col items-center text-center px-8 py-4 group ${
                index < TRUST_ITEMS.length - 1
                  ? 'border-b md:border-b-0 md:border-r border-surface'
                  : ''
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                <Icon
                  className="w-8 h-8 text-primary group-hover:animate-float"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="font-bold text-text-primary text-base mb-2">{title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
