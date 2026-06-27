import Link from 'next/link'
import Image from 'next/image'
import Button from '@/app/components/ui/Button'
import { SITE_NAV_LINKS, POLICY_LINKS } from '@/lib/siteNav'

// ─── Social icons ─────────────────────────────────────────────────────────────

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  )
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { Icon: IconFacebook, href: '#', label: 'Facebook' },
  { Icon: IconInstagram, href: '#', label: 'Instagram' },
  { Icon: IconYoutube, href: '#', label: 'YouTube' },
  { Icon: IconX, href: '#', label: 'X' },
]

const SKY_TEXT_SHADOW = '[text-shadow:0_1px_8px_rgba(255,255,255,0.85)]'
const FOOTER_LINK_FOCUS =
  'rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2'

// ─── Sub-components ───────────────────────────────────────────────────────────

function FooterLinkColumn({
  heading,
  links,
  compact = false,
}: {
  heading: string
  links: { label: string; href: string }[]
  compact?: boolean
}) {
  return (
    <div>
      <h4
        className={`mb-1.5 font-bold uppercase tracking-[0.16em] text-secondary ${compact ? 'text-[11px] md:text-xs' : 'text-xs md:text-sm'} ${compact ? SKY_TEXT_SHADOW : ''}`}
      >
        {heading}
      </h4>
      <ul className={`flex flex-col ${compact ? 'gap-1 md:gap-1.5' : 'gap-2'}`}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`group inline-flex items-center gap-1.5 font-medium text-text-primary/90 transition-colors hover:text-secondary ${compact ? 'text-xs md:text-sm' : 'text-sm md:text-base'} ${compact ? SKY_TEXT_SHADOW : ''} ${FOOTER_LINK_FOCUS}`}
            >
              <span
                className={`shrink-0 rounded-full bg-primary transition-transform group-hover:scale-125 ${compact ? 'h-1 w-1' : 'h-1.5 w-1.5'}`}
                aria-hidden
              />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FooterMarketing({
  compact = false,
  showCTAs = true,
}: {
  compact?: boolean
  showCTAs?: boolean
}) {
  return (
    <div className={compact ? 'text-center' : ''}>
      <p
        className={`text-gradient-green font-semibold uppercase tracking-[0.2em] ${compact ? 'text-xs' : 'text-[10px] sm:text-xs'} ${SKY_TEXT_SHADOW}`}
      >
        Rooted in Rajasthan
      </p>
      <h2
        className={`font-bold text-text-primary ${compact ? 'mt-2 text-lg leading-relaxed' : 'mt-1.5 text-sm leading-relaxed sm:mt-2 sm:text-base md:text-lg md:leading-relaxed'} ${SKY_TEXT_SHADOW}`}
      >
        Pure ghee. Honest farms.{' '}
        <span className="text-gradient-green">Your family deserves both.</span>
      </h2>
      <p
        className={`text-text-secondary/85 ${compact ? 'mx-auto mt-3 max-w-md text-sm leading-relaxed' : 'mt-2 max-w-sm text-[11px] leading-relaxed sm:mt-2.5 sm:text-xs md:mt-3'} ${SKY_TEXT_SHADOW}`}
      >
        A2 Bilona ghee crafted with patience — from trusted Rajasthani farmers straight to your kitchen.
      </p>
      {showCTAs && (
        <div className={`mt-2 flex flex-wrap gap-2 ${compact ? 'justify-center' : ''}`}>
          <Button href="/products" size="sm" rightIcon={<span aria-hidden>→</span>}>
            Shop Ghee
          </Button>
          <Button href="/about" variant="secondary" size="sm">
            Reach Us
          </Button>
        </div>
      )}
    </div>
  )
}

function FooterNav({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid grid-cols-2 ${compact ? 'ml-2 gap-6 md:ml-3' : 'gap-3 sm:gap-4'}`}>
      <FooterLinkColumn heading="Explore" links={SITE_NAV_LINKS} compact={compact} />
      <FooterLinkColumn heading="Policies" links={POLICY_LINKS} compact={compact} />
    </div>
  )
}

function FooterSocialIcons({ variant = 'sky' }: { variant?: 'sky' | 'bar' }) {
  const isBar = variant === 'bar'
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {SOCIAL_LINKS.map(({ Icon, href, label }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          className={
            isBar
              ? 'flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-200 hover:scale-105 hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 sm:h-8 sm:w-8'
              : 'flex h-8 w-8 items-center justify-center rounded-full border border-secondary/20 bg-primary/15 text-secondary shadow-sm transition-all duration-200 hover:scale-105 hover:border-secondary hover:bg-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2'
          }
        >
          <Icon />
        </Link>
      ))}
    </div>
  )
}

function FooterBottomBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-[#1a4a35]/90 via-[#0f3325]/92 to-[#1a4a35]/90 px-4 py-2.5 backdrop-blur-[2px] sm:py-3 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-center text-xs font-semibold tracking-tight text-white sm:text-left sm:text-sm">
          © {new Date().getFullYear()} Aavya Foods · Purity in Every Drop
        </p>
        <p className="hidden text-center text-xs text-white/80 sm:block sm:text-sm">
          <span className="font-semibold text-white">FSSAI registered</span>
          {' · '}
          Farm-direct delivery across India
        </p>
        <FooterSocialIcons variant="bar" />
      </div>
      <p className="mt-1.5 text-center text-xs text-white/75 sm:hidden">
        <span className="font-semibold text-white/90">FSSAI registered</span>
        {' · '}
        Farm-direct delivery across India
      </p>
      <p className="mt-1 text-center text-xs text-white/65 sm:mt-1.5 sm:text-sm">
        Registered in Rajasthan, India · Farmer network across local farms
      </p>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Footer layout zones (1635×450 art):
 * - Left 0–28%: logo + camels — keep clear
 * - Center sky 28–58% × 6–38%: marketing copy
 * - Right sky 58–82% × 6–38%: nav columns
 * - Bottom strip: copyright + trust + social
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#ede9c8]">
      {/* Footer illustration — unobstructed on mobile */}
      <div className="relative">
        <Image
          src="/aavya/footer-logo-fix.png"
          alt="Aavya Foods — Purity in Every Drop"
          width={1635}
          height={450}
          className="block h-auto w-full"
          priority
          unoptimized
        />

        {/* Sky-band overlay (sm+) — stays within top ~38% of art */}
        <div className="absolute left-[28%] right-[4%] top-[6%] hidden h-[34%] overflow-hidden sm:grid sm:grid-cols-2 sm:items-start sm:gap-3 md:grid-cols-[1fr_1fr] md:gap-4 lg:gap-6">
          <FooterMarketing showCTAs={false} />
          <FooterNav compact />
          </div>

        {/* Bottom bar overlaid on dune band (sm+) */}
        <FooterBottomBar className="absolute inset-x-0 bottom-0 hidden sm:block" />
      </div>

      {/* Mobile content panel — below art, no overlay */}
      <div className="border-t border-secondary/10 bg-[#f5f0dc] px-5 py-6 sm:hidden">
        <FooterMarketing compact />
        <div className="mt-10 border-t border-secondary/10 pt-8">
          <FooterNav />
        </div>
      </div>

      {/* Mobile bottom bar */}
      <FooterBottomBar className="sm:hidden" />
    </footer>
  )
}
