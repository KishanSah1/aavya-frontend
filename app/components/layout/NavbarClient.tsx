'use client'

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShoppingCart, Search, User, LogOut, LayoutDashboard, Package, Coins } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { useAuthStore } from '@/lib/store/authStore'
import type { NavLink } from '@/lib/types'

interface NavbarClientProps {
  links: NavLink[]
}

export default function NavbarClient({ links }: NavbarClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  )
  const hasHydrated = useCartStore((s) => s._hasHydrated)
  const { user, openModal, logout } = useAuthStore()
  const resetCart = useCartStore((s) => s.resetCart)

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchQuery('')
  }, [])

  const openSearch = useCallback(() => {
    setIsOpen(false)
    setSearchOpen(true)
  }, [])

  const handleSearchSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault()
      const q = searchQuery.trim()
      closeSearch()
      router.push(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
    },
    [searchQuery, closeSearch, router]
  )

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!searchOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch()
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => {
      if (window.innerWidth >= 768) {
        searchInputRef.current?.focus()
      } else {
        mobileSearchInputRef.current?.focus()
      }
    }, 50)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [searchOpen, closeSearch])

  const searchFieldClass =
    'flex flex-1 items-center gap-2 bg-surface rounded-full px-4 py-2 ring-1 ring-secondary/20 focus-within:ring-secondary/50 transition-all min-w-0'

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'border-surface/60 bg-white/[0.98] backdrop-blur-xl shadow-lg shadow-black/[0.06]'
          : 'border-surface bg-background/95 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div
          className={`relative flex items-center justify-between gap-3 transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/aavya/logo.jpeg"
              alt="Aavya Foods"
              width={180}
              height={80}
              className={`object-contain transition-all duration-300 ${scrolled ? 'h-11' : 'h-[68px]'}`}
              style={{ width: 'auto' }}
              priority
            />
          </Link>

          {/* Desktop inline search (replaces nav when open) */}
          {searchOpen ? (
            <form
              onSubmit={handleSearchSubmit}
              className={`${searchFieldClass} hidden md:flex mx-2`}
            >
              <Search className="w-4 h-4 text-text-secondary shrink-0" aria-hidden />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ghee, products…"
                className="flex-1 min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 outline-none"
                aria-label="Search products"
              />
              <button
                type="button"
                onClick={closeSearch}
                className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
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
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={[
                    'relative px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5',
                    'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
                    'after:h-[2px] after:bg-secondary after:transition-all after:duration-300',
                    pathname.startsWith('/admin')
                      ? 'text-secondary after:w-[calc(100%-2rem)]'
                      : 'text-text-primary hover:text-secondary after:w-0 hover:after:w-[calc(100%-2rem)]',
                  ].join(' ')}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => (searchOpen ? closeSearch() : openSearch())}
              className="group p-2.5 rounded-full text-text-secondary hover:text-secondary hover:bg-secondary/10 hover:ring-2 hover:ring-secondary/30 active:scale-90 transition-all duration-200"
              aria-label={searchOpen ? 'Close search' : 'Search'}
            >
              {searchOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full text-text-secondary hover:text-secondary hover:bg-secondary/10 transition-all duration-200"
                  aria-label="Account"
                >
                  <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                    {(user.name ?? user.phone ?? 'U')[0].toUpperCase()}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-surface py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {user.name && <p className="px-4 pt-2 pb-0.5 text-sm font-semibold text-text-primary truncate">{user.name}</p>}
                  <p className="px-4 pb-2 text-xs text-text-secondary truncate">{user.phone ?? user.email}</p>
                  <hr className="border-surface mx-2 my-1" />
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors"
                  >
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <Link
                    href="/account/wallet"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface transition-colors"
                  >
                    <Coins className="w-4 h-4" /> Wallet & Referrals
                  </Link>
                  <hr className="border-surface mx-2 my-1" />
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={openModal}
                className="group p-2.5 rounded-full text-text-secondary hover:text-secondary hover:bg-secondary/10 hover:ring-2 hover:ring-secondary/30 active:scale-90 transition-all duration-200"
                aria-label="Login"
              >
                <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              </button>
            )}

            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-gradient-to-r from-secondary to-secondary-light text-white font-semibold px-4 py-2 rounded-full hover:opacity-90 hover:shadow-md hover:shadow-secondary/25 transition-all duration-200 ml-1"
            >
              <ShoppingCart className="w-4 h-4" />
              {mounted && hasHydrated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

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
        </div>

        {/* Mobile inline search row (inside header) */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className={`${searchFieldClass} md:hidden pb-3 animate-reveal-fade`}
          >
            <Search className="w-4 h-4 text-text-secondary shrink-0" aria-hidden />
            <input
              ref={mobileSearchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for ghee, products…"
              className="flex-1 min-w-0 bg-transparent text-sm text-text-primary placeholder:text-text-secondary/60 outline-none"
              aria-label="Search products"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="text-text-secondary hover:text-text-primary transition-colors shrink-0"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Mobile menu */}
        {isOpen && !searchOpen && (
          <nav className="md:hidden flex flex-col pb-4 gap-1 animate-reveal-fade">
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
                    'px-4 py-3 rounded-xl font-medium transition-all duration-200',
                    isActive
                      ? 'bg-secondary/10 text-secondary'
                      : 'text-text-primary hover:bg-surface hover:text-secondary',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={[
                  'px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2',
                  pathname.startsWith('/admin')
                    ? 'bg-secondary/10 text-secondary'
                    : 'text-text-primary hover:bg-surface hover:text-secondary',
                ].join(' ')}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-reveal-fade"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-modal-in">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-text-primary text-center mb-1">Log out?</h2>
            <p className="text-text-secondary text-sm text-center mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 border border-surface text-text-primary font-semibold py-2.5 rounded-xl text-sm hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { logout(); resetCart(); setShowLogoutConfirm(false) }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
