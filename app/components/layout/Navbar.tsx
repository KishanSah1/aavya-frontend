import NavbarClient from './NavbarClient'
import { SITE_NAV_LINKS } from '@/lib/siteNav'

export default function Navbar() {
  return <NavbarClient links={SITE_NAV_LINKS} />
}
