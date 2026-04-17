import Image from 'next/image'
import Link from 'next/link'
import { Leaf } from 'lucide-react'
import Button from '@/app/components/ui/Button'

function StorySection({
  title,
  children,
  imageSrc,
  imageAlt,
  imageSide,
}: {
  title: string
  children: React.ReactNode
  imageSrc: string
  imageAlt: string
  imageSide: 'left' | 'right'
}) {
  const imageBlock = (
    <div className="relative aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-[2rem] overflow-hidden shadow-xl ring-1 ring-black/[0.06]">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 45vw" />
    </div>
  )

  const textBlock = (
    <div className="flex flex-col justify-center space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-secondary leading-snug tracking-tight">{title}</h2>
      <div className="text-text-secondary text-base md:text-lg leading-relaxed space-y-4">{children}</div>
    </div>
  )

  return (
    <section className="py-14 md:py-20 border-t border-surface/80 first:border-t-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {imageSide === 'left' ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </section>
  )
}

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

      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Intro — Fortune-style watermark + headline */}
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

        {/* Opening narrative — your voice, Fortune-style lead */}
        <div className="relative max-w-none text-center pb-12 md:pb-16 border-b border-surface">
          <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            We work closely with farmers who&apos;ve been doing this for years, sometimes for generations. For them,
            it&apos;s not just work, it is routine, care, and a way of life.
          </p>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            And honestly, that&apos;s where everything starts.
          </p>
        </div>

        <StorySection
          title="From curd to ghee — the Bilona method"
          imageSrc="/aavya/farm-story.png"
          imageAlt="Farms and landscape in Rajasthan — where our story begins"
          imageSide="left"
        >
          <p>
            From there, we follow the traditional Bilona method. Milk is first turned into curd, then slowly
            hand-churned into butter, and gently cooked into ghee.
          </p>
          <p>
            It takes time, and it&apos;s not the easiest way to do it, but it&apos;s the way that keeps everything real.
          </p>
        </StorySection>

        <StorySection
          title="Pure and simple"
          imageSrc="/aavya/product.jpeg"
          imageAlt="Aavya pure ghee — nothing unnecessary"
          imageSide="right"
        >
          <p>
            We don&apos;t add anything extra. No preservatives, no shortcuts, nothing unnecessary. Just pure ghee,
            made with the kind of care you can actually notice.
          </p>
        </StorySection>

        <StorySection
          title="Start right. Let the ghee speak."
          imageSrc="/aavya/product.jpeg"
          imageAlt="Pure Aavya ghee — the result of patience and tradition"
          imageSide="left"
        >
          <p>
            Because at the end of the day, it&apos;s simple — if you start right and don&apos;t interfere too much, the
            result speaks for itself.
          </p>
        </StorySection>

        {/* Closing + CTA */}
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
