import Link from 'next/link'
import type { ReactNode } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT } from '@/lib/contact'

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type ContactRowProps = {
  icon: ReactNode
  label: string
  value: string
  href?: string
  external?: boolean
  ariaLabel: string
}

function ContactRow({ icon, label, value, href, external, ariaLabel }: ContactRowProps) {
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-secondary sm:h-9 sm:w-9">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary/70 sm:text-[11px]">
          {label}
        </span>
        <span className="block truncate text-xs font-medium text-text-primary sm:text-sm">{value}</span>
      </span>
    </>
  )

  if (!href) {
    return <div className="flex items-center gap-2.5 sm:gap-3">{content}</div>
  }

  const className =
    'flex items-center gap-2.5 sm:gap-3 rounded-xl p-1 -m-1 transition-colors hover:bg-secondary/5 group'

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={className}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {content}
    </Link>
  )
}

export default function ContactHeroCard() {
  return (
    <aside
      className="absolute top-[40%] -translate-y-1/2 z-10 w-[calc(100%-1.5rem)] max-w-[220px] right-6 sm:right-10 sm:max-w-[260px] md:right-16 md:max-w-[280px] lg:right-24 xl:right-28"
      aria-label="Contact information"
    >
      <div className="rounded-2xl border border-white/60 bg-white/75 p-3.5 shadow-lg backdrop-blur-md sm:p-4">
        <div className="mb-3 border-b border-secondary/10 pb-3 sm:mb-4 sm:pb-4">
          <p className="text-gradient-green text-[10px] font-semibold uppercase tracking-[0.18em] sm:text-xs">
            Reach Us
          </p>
          <p className="mt-1 text-[11px] leading-snug text-text-secondary/80 sm:text-xs">
            We&apos;d love to hear from you
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:gap-3.5">
          <ContactRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
            ariaLabel="Email Aavya Foods"
          />
          <ContactRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={CONTACT.phoneDisplay}
            href={`tel:${CONTACT.phone}`}
            ariaLabel="Call Aavya Foods"
          />
          <ContactRow
            icon={<IconWhatsApp />}
            label="WhatsApp"
            value={CONTACT.phoneDisplay}
            href={CONTACT.whatsapp}
            external
            ariaLabel="WhatsApp Aavya Foods"
          />
          <ContactRow
            icon={<IconInstagram />}
            label="Instagram"
            value={CONTACT.instagramHandle}
            href={CONTACT.instagram}
            external
            ariaLabel="Follow Aavya Foods on Instagram"
          />
          <ContactRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={CONTACT.location}
            ariaLabel="Aavya Foods location"
          />
        </div>
      </div>
    </aside>
  )
}
