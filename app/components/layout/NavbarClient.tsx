'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShoppingCart, Search, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import type { NavLink } from '@/lib/types'

interface NavbarClientProps {
  links: NavLink[]
}

export default function NavbarClient({ links }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const totalItems = useCartStore((s) => s.totalItems())
  const pathname = usePathname()

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href === '/products' && pathname.startsWith('/products'))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
                'after:h-[2px] after:bg-secondary after:transition-all after:duration-300',
                isActive
                  ? 'text-secondary after:w-[calc(100%-2rem)]'
                  : 'text-text-primary hover:text-secondary after:w-0 hover:after:w-[calc(100%-2rem)]',
              ].join(' ')}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          onClick={() => setSearchOpen((o) => !o)}
          className="group p-2.5 rounded-full text-text-secondary hover:text-secondary hover:bg-secondary/10 hover:ring-2 hover:ring-secondary/30 active:scale-90 transition-all duration-200"
          aria-label="Search"
        >
          <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        </button>

        {/* Profile */}
        <Link
          href="/profile"
          className="group p-2.5 rounded-full text-text-secondary hover:text-secondary hover:bg-secondary/10 hover:ring-2 hover:ring-secondary/30 active:scale-90 transition-all duration-200"
          aria-label="Profile"
        >
          <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        </Link>

        {/* Cart */}
        <Link
          href="/cart"
          className="relative flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity ml-1"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors ml-1"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-text-primary" />
          ) : (
            <Menu className="w-5 h-5 text-text-primary" />
          )}
        </button>
      </div>

      {/* Search bar dropdown */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-surface shadow-md px-4 py-3 z-50">
          <div className="max-w-2xl mx-auto flex items-center gap-3 bg-surface rounded-full px-4 py-2">
            <Search className="w-4 h-4 text-text-secondary shrink-0" />
            <input
              autoFocus
              type="text"
              placeholder="Search for ghee, products..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 outline-none"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-surface shadow-lg z-50">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/products' && pathname.startsWith('/products'))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    'px-4 py-3 rounded-lg font-medium transition-colors',
                    isActive
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-text-primary hover:bg-surface hover:text-secondary',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
