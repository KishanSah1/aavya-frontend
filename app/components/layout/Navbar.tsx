import Image from 'next/image'
import Link from 'next/link'
import NavbarClient from './NavbarClient'
import type { NavLink } from '@/lib/types'

const NAV_LINKS: NavLink[] = [
  { label: 'Our Roots', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'The Journey', href: '/journey' },
  { label: 'Reach Us', href: '/about' },
  { label: 'Seller', href: '/seller' },
]

export default function Navbar() {
  return (
    <>
      {/* Navbar — sticky */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface shadow-sm">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/aavya/logo.jpeg"
              alt="Aavya Foods"
              width={180}
              height={80}
              className="object-contain"
              style={{ height: '80px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Cart + Mobile toggle */}
          <NavbarClient links={NAV_LINKS} />
        </div>
      </header>
    </>
  )
}
