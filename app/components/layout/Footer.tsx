import Link from 'next/link'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'

// ─── Social SVG icons ─────────────────────────────────────────────────────────

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'Our Roots', href: '/' },
      { label: 'Products', href: '/products' },
      { label: 'The Journey', href: '/journey' },
      { label: 'Reach Us', href: '/about' },
      { label: 'Blogs', href: '/blogs' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Refund Policy', href: '/returns' },
      { label: 'Terms of Services', href: '/terms' },
    ],
  },
]

const SOCIAL_LINKS = [
  { Icon: IconFacebook,  href: '#', label: 'Facebook'  },
  { Icon: IconInstagram, href: '#', label: 'Instagram' },
  { Icon: IconYoutube,   href: '#', label: 'YouTube'   },
  { Icon: IconX,         href: '#', label: 'X'         },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background — exact 1640×459 aspect ratio, never crops */}
      <Image
        src="/aavya/footer-bg.png"
        alt=""
        width={1640}
        height={459}
        className="w-full h-auto block"
        aria-hidden
        priority
      />

      {/* Content — absolutely overlaid on the image */}
      <div className="absolute inset-0 flex flex-col justify-between">

        {/* ── Main grid — positioned in the light upper area ── */}
        <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 md:px-12 pt-[5%] sm:pt-[6%] pb-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-x-10 md:gap-y-8 lg:gap-x-14">

            {/* Brand */}
            <div className="sm:col-span-2 md:col-span-1 max-w-sm md:max-w-none">
              <Image
                src="/aavya/logo.jpeg"
                alt="Aavya Foods"
                width={120}
                height={46}
                className="object-contain mb-4"
                style={{ height: '42px', width: 'auto' }}
              />
              <p className="text-text-primary text-sm leading-relaxed mb-4 max-w-[22rem]">
                Rooted in Rajasthan, Aavya Foods brings pure dairy directly from trusted farmers to your home.
              </p>
              <p className="text-text-secondary text-sm leading-relaxed">
                <span className="font-medium text-text-primary">Registered in:</span> Rajasthan, India
              </p>
              <p className="text-text-secondary text-sm leading-relaxed mt-2">
                <span className="font-medium text-text-primary">Farmer network:</span> Local farms across Rajasthan
              </p>
            </div>

            {/* Link columns */}
            {NAV_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="text-text-primary font-bold text-xs uppercase tracking-[0.14em] mb-4">
                  {col.heading}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-secondary hover:text-secondary-light hover:underline underline-offset-4 transition-colors inline-flex items-start gap-2"
                      >
                        <span className="text-primary mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Need Help */}
            <div>
              <h4 className="text-text-primary font-bold text-xs uppercase tracking-[0.14em] mb-4">
                Need Help?
              </h4>
              <Button href="/about" size="md" rightIcon={<span aria-hidden className="text-base leading-none">→</span>}>
                Contact Us
              </Button>
              <div className="flex flex-wrap gap-2.5 mt-5">
                {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-full bg-secondary/15 hover:bg-secondary text-secondary hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                  >
                    <Icon />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar — on the dark green area of the image (high contrast for readability) ── */}
        <div className="pb-5 pt-4 px-5 sm:px-8 text-center max-w-3xl mx-auto">
          <p className="text-white text-sm sm:text-base font-semibold tracking-tight drop-shadow-sm">
            © {new Date().getFullYear()} Aavya Foods. All rights reserved.
          </p>
          <p className="text-white/90 text-sm leading-relaxed mt-2.5">
            Registered office: Rajasthan, India
            <span className="hidden sm:inline"> · </span>
            <span className="block sm:inline mt-1 sm:mt-0">
              Farmer network: Local farms across Rajasthan
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
