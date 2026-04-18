import Image from 'next/image'
import { Leaf } from 'lucide-react'

const STEPS = [
  {
    title: 'Our Farmers',
    description:
      'Everything begins at the source. We work closely with farmers who care for their cows with patience, respect, and consistency, not shortcuts. Their everyday dedication ensures the milk we begin with is as pure and honest as it should be.',
    image: '/aavya/journey-steps/step1.webp',
  },
  {
    title: 'Slow Churned',
    description:
      'The milk is first set into curd, then gently hand-churned using the traditional Bilona method. No machines speeding things up, just time, effort, and a process trusted for generations to bring out the true richness of ghee.',
    image: '/aavya/journey-steps/step2.webp',
  },
  {
    title: 'Nothing Added',
    description:
      'We keep the process clean and simple. No preservatives, no additives, nothing unnecessary. We don\'t try to change what\'s already good, because real ghee doesn\'t need improving; it just needs to be respected.',
    image: '/aavya/journey-steps/step3.webp',
  },
  {
    title: 'Truly Pure',
    description:
      'What\'s created is ghee in its most natural form. Rich in aroma, balanced in texture, and made with complete honesty, something you can feel confident adding to your everyday meals.',
    image: '/aavya/journey-steps/step4.webp',
  },
  {
    title: 'Sealed with Care',
    description:
      'Once ready, the ghee is carefully packed to preserve its freshness, aroma, and purity. So when it reaches your kitchen, it carries the same quality and care it started with.',
    image: '/aavya/journey-steps/step5.webp',
  },
] as const

function StepCircle({
  src,
  alt,
  stepNum,
}: {
  src: string
  alt: string
  stepNum: number
}) {
  return (
    <div className="relative z-10 flex flex-col items-center shrink-0">
      <div
        className={[
          'relative w-[7.5rem] h-[7.5rem] sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden',
          'ring-[3px] ring-primary ring-offset-[6px] ring-offset-[#FDFCF0]',
          'shadow-lg shadow-secondary/10',
          'border-[3px] border-secondary/90',
        ].join(' ')}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 120px, 160px" />
      </div>
      <span
        className="mt-3 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-white text-sm font-bold shadow-md md:hidden"
        aria-hidden
      >
        {stepNum}
      </span>
    </div>
  )
}

function StepText({
  title,
  description,
  stepNum,
  align,
}: {
  title: string
  description: string
  stepNum: number
  align: 'left' | 'right'
}) {
  return (
    <div
      className={[
        'max-w-md',
        align === 'left' ? 'md:text-right md:ml-auto md:pr-4' : 'md:text-left md:mr-auto md:pl-4',
      ].join(' ')}
    >
      <span className="hidden md:inline-flex mb-2 items-center gap-2 text-secondary font-bold text-xs uppercase tracking-[0.15em]">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-white text-xs font-extrabold">
          {stepNum}
        </span>
        Step {stepNum}
      </span>
      <h2 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight mb-3">{title}</h2>
      <p className="text-text-secondary leading-relaxed text-[15px] sm:text-base">{description}</p>
    </div>
  )
}

export default function JourneyPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF0]">
      {/* Intro */}
      <section className="border-b border-secondary/10 bg-gradient-to-b from-background to-[#FDFCF0]">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-12 pb-10 md:pt-16 md:pb-14 text-center md:text-left">
          <p className="flex items-center justify-center md:justify-start gap-2 text-secondary font-semibold text-xs uppercase tracking-[0.2em] mb-4">
            <Leaf className="w-4 h-4 text-primary" aria-hidden />
            How we make it
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-[2.35rem] font-extrabold text-secondary leading-[1.12] tracking-tight max-w-3xl">
            Aavya&apos;s Process of Perfection
          </h1>
          <p className="mt-5 text-text-secondary text-base md:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
            From the farm to your kitchen — five steps carried out with patience, honesty, and nothing left out.
          </p>
        </div>
      </section>

      {/* Timeline — desktop: zigzag + center dotted line; mobile: vertical stack with left rail */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="relative">
          {/* Center dotted line — desktop only */}
          <div
            className="pointer-events-none absolute left-1/2 top-4 bottom-4 hidden md:block w-0 -translate-x-1/2 border-l-[3px] border-dotted border-secondary/40 z-0"
            aria-hidden
          />

          <ol className="relative z-[1] space-y-14 md:space-y-0">
            {STEPS.map((step, index) => {
              const stepNum = index + 1
              const isLeft = index % 2 === 0
              const alt = `${step.title} — step ${stepNum} of ${STEPS.length}`

              return (
                <li key={step.title} className="md:py-8 first:md:pt-0 last:md:pb-0">
                  {/* Mobile */}
                  <div className="relative flex gap-5 md:hidden pl-2">
                    <div className="absolute left-[1.35rem] top-0 bottom-0 w-0 border-l-2 border-dotted border-secondary/40" aria-hidden />
                    <div className="relative z-10 pt-1">
                      <StepCircle src={step.image} alt={alt} stepNum={stepNum} />
                    </div>
                    <div className="flex-1 pb-2 pt-0">
                      <StepText
                        title={step.title}
                        description={step.description}
                        stepNum={stepNum}
                        align="left"
                      />
                    </div>
                  </div>

                  {/* Desktop zigzag */}
                  <div className="hidden md:grid md:grid-cols-[1fr_minmax(10rem,auto)_1fr] md:gap-x-6 md:items-center md:min-h-[min(12rem,28vh)] lg:min-h-[200px]">
                    {isLeft ? (
                      <>
                        <StepText
                          title={step.title}
                          description={step.description}
                          stepNum={stepNum}
                          align="left"
                        />
                        <div className="flex justify-center py-2">
                          <StepCircle src={step.image} alt={alt} stepNum={stepNum} />
                        </div>
                        <div aria-hidden className="min-h-[1px]" />
                      </>
                    ) : (
                      <>
                        <div aria-hidden className="min-h-[1px]" />
                        <div className="flex justify-center py-2">
                          <StepCircle src={step.image} alt={alt} stepNum={stepNum} />
                        </div>
                        <StepText
                          title={step.title}
                          description={step.description}
                          stepNum={stepNum}
                          align="right"
                        />
                      </>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </section>
    </div>
  )
}
