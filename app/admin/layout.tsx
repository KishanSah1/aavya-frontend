'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Tag, Ticket, Gift } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/referrals', label: 'Referrals', icon: Gift },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user === null || user?.role !== 'admin') router.replace('/')
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-surface flex flex-col py-6 px-3 sticky top-0 h-screen">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest px-3 mb-4">Admin Panel</p>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-secondary/10 text-secondary'
                    : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                ].join(' ')}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
