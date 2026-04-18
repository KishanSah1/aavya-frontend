import NavbarClient from './NavbarClient'
import type { NavLink } from '@/lib/types'

const NAV_LINKS: NavLink[] = [
  { label: 'Our Roots', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'The Journey', href: '/journey' },
  { label: 'Reach Us', href: '/about' },
  { label: 'Our Stories', href: '/seller' },
]

export default function Navbar() {
  return <NavbarClient links={NAV_LINKS} />
}
