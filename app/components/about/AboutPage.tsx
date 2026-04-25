import Image from 'next/image'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import Button from '@/app/components/ui/Button'
import ConversationSection from './ConversationSection'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero — full-width brand banner */}
      <div className="w-full bg-surface/50">
        <Image
          src="/aavya/about-hero-bg.png"
          alt="Aavya Foods — Pure Rajasthani ghee, tradition and craft"
          width={1920}
          height={960}
          className="w-full h-auto block"
          priority
          sizes="100vw"
        />
      </div>

      {/* Constrained header + intro */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <header className="relative text-center pt-14 md:pt-20 pb-6 md:pb-10 overflow-hidden">
          <p
            className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(4rem,18vw,11rem)] font-extrabold leading-none text-text-primary/[0.06] whitespace-nowrap"
            aria-hidden
          >
            our story
          </p>
          <p className="relative flex items-center justify-center gap-2 text-secondary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            <Leaf className="w-4 h-4 text-primary" aria-hidden />
            Aavya Foods
          </p>
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight leading-[1.15] mb-6">
            From Rajasthan, With Purity
          </h1>
          <div className="relative w-16 h-1 bg-gradient-green rounded-full mx-auto mb-10" />
          <p className="relative text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            Our story begins in <strong className="font-semibold text-text-primary">Rajasthan</strong>, where things
            are still done the way they&apos;re meant to be.
          </p>
        </header>

        <div className="relative max-w-none text-center pb-12 md:pb-16 border-b border-surface">
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            We work closely with farmers who&apos;ve been doing this for years, sometimes for generations. For them,
            it&apos;s not just work, it is routine, care, and a way of life.
          </p>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            And honestly, that&apos;s where everything starts.
          </p>
        </div>
      </div>

      {/* Conversation — wider container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <ConversationSection />
      </div>

      {/* Closing + CTA */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <section className="py-16 md:py-20 text-center border-t border-surface">
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            From Rajasthan, with care — that&apos;s the Aavya way.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/products" size="lg" rightIcon={<span aria-hidden>→</span>}>
              Explore our ghee
            </Button>
            <Link
              href="mailto:hello@aavyafoods.com"
              className="text-sm font-semibold text-secondary hover:text-secondary-light underline-offset-4 hover:underline transition-colors"
            >
              hello@aavyafoods.com
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
