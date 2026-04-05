import Image from 'next/image'
import Link from 'next/link'
import { Tag } from 'lucide-react'
import NavbarClient from './NavbarClient'
import type { NavLink } from '@/lib/types'

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact Us', href: '/contact' },
]

export default function Navbar() {
  return (
    <>
      {/* Offer bar — not sticky, scrolls away */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-text-primary text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
        <Tag className="w-3 h-3 shrink-0" />
        <span>
          Use code <strong className="tracking-wide">PURE10</strong> for 10%
          off on your first order &nbsp;·&nbsp; Free shipping above ₹999
        </span>
      </div>

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

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium text-text-primary hover:text-secondary hover:bg-surface transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile toggle */}
          <NavbarClient links={NAV_LINKS} />
        </div>
      </header>
    </>
  )
}
