'use client'

import { Leaf } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function OfferBar() {
  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-dark text-text-primary text-xs py-2 px-4 text-center flex items-center justify-center gap-2">
      <Leaf className="w-3 h-3 shrink-0" />
      <span>Rooted in nature &nbsp;·&nbsp; Crafted with care &nbsp;·&nbsp; Pure in every bite</span>
    </div>
  )
}
