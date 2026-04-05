import Link from 'next/link'
import Image from 'next/image'
import { Construction, Home } from 'lucide-react'
import GoBackButton from './components/GoBackButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white">
      {/* Logo */}
      <Link href="/" className="mb-10">
        <Image
          src="/aavya/logo.jpeg"
          alt="Aavya Foods"
          width={140}
          height={50}
          style={{ height: '50px', width: 'auto' }}
          className="object-contain"
        />
      </Link>

      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary-dark/10 flex items-center justify-center mb-6">
        <Construction className="w-12 h-12 text-primary" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-3 text-center">
        Work in Progress
      </h1>
      <div className="w-16 h-1 bg-gradient-green rounded-full mb-5" />
      <p className="text-text-secondary text-center max-w-sm leading-relaxed mb-2">
        This page is currently being crafted with the same care we put into our
        ghee.
      </p>
      <p className="text-text-secondary/60 text-sm text-center mb-10">
        Check back soon — good things take time.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-green text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity shadow-md"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <GoBackButton />
      </div>
    </div>
  )
}
