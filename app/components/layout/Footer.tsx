import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail } from 'lucide-react'

const FOOTER_COLUMNS = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Products', href: '/products' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    heading: 'Customer Care',
    links: [
      { label: 'Track Order', href: '/track' },
      { label: 'Returns & Refunds', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Bulk Orders', href: '/bulk' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  },
  {
    heading: 'Delivery Areas',
    links: [
      { label: 'Pan India Delivery', href: '/delivery' },
      { label: 'Same-Day: Mumbai', href: '/delivery#mumbai' },
      { label: 'Same-Day: Pune', href: '/delivery#pune' },
      { label: 'Same-Day: Delhi NCR', href: '/delivery#delhi' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-green text-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Image
              src="/aavya/logo.jpeg"
              alt="Aavya Foods"
              width={100}
              height={34}
              className="object-contain rounded-lg mb-4 brightness-0 invert"
              style={{ height: '40px', width: 'auto' }}
            />
            <p className="text-background/75 text-sm leading-relaxed mb-4">
              Pure A2 Bilona Ghee crafted with tradition. From our farm to your
              table.
            </p>
            <div className="flex flex-col gap-2 text-sm text-background/75">
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                +91 98765 43210
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                hello@aavyafoods.in
              </span>
              <span className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                Maharashtra, India
              </span>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">
                {col.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-background/75 hover:text-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 pt-4 text-center text-background/50 text-xs">
          © {new Date().getFullYear()} Aavya Foods. All rights reserved. Made
          with love in India.
        </div>
      </div>
    </footer>
  )
}
