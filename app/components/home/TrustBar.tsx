import { Sprout, FlaskConical, ShieldCheck } from 'lucide-react'

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
    <section className="bg-background border-y border-surface py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {TRUST_ITEMS.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className={`flex flex-col items-center text-center px-8 py-4 group ${
              index < TRUST_ITEMS.length - 1
                ? 'border-b md:border-b-0 md:border-r border-surface'
                : ''
            }`}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h3 className="font-bold text-text-primary text-base mb-2">
              {title}
            </h3>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
