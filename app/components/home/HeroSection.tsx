import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="w-full">
      <Image
        src="/aavya/hero-bg3.png"
        alt="Pure Desi Cow Ghee — Aavya Foods"
        width={1440}
        height={720}
        priority
        className="w-full h-auto block"
      />
    </section>
  )
}
