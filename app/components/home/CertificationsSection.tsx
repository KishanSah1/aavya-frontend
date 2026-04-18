'use client'

import { ShieldCheck, FlaskConical, Leaf } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import ScrollReveal from '@/app/components/ScrollReveal'

// ─── Data ──────────────────────────────────────────────────────────────────────

interface Cert {
  id: string
  name: string
  sub: string
  tagline: string
  icon: LucideIcon
  headerBg: string      // header band gradient on certificate
  sealColor: string     // seal ring color
  doc: {
    issuer: string
    issuerShort: string
    number: string
    issued: string
    valid: string
    scope: string
  }
}

const CERTS: Cert[] = [
  {
    id: 'fssai',
    name: 'FSSAI',
    sub: 'Licensed',
    tagline: "India's highest food safety authority",
    icon: ShieldCheck,
    headerBg: 'from-[#0d2137] to-[#1a3a5c]',
    sealColor: '#1a3a5c',
    doc: {
      issuer: 'Food Safety and Standards Authority of India',
      issuerShort: 'FSSAI, Govt. of India',
      number: 'Lic. No. 24220244000####',
      issued: '15 Mar 2024',
      valid: '14 Mar 2026',
      scope: 'Manufacturing & Sale of Ghee and Dairy Products',
    },
  },
  {
    id: 'nabl',
    name: 'NABL',
    sub: 'Lab Verified',
    tagline: 'Every batch independently tested',
    icon: FlaskConical,
    headerBg: 'from-[#0d3330] to-[#114e49]',
    sealColor: '#0d3330',
    doc: {
      issuer: 'National Accreditation Board for Testing & Calibration Laboratories',
      issuerShort: 'NABL, Dept. of Science & Technology',
      number: 'Accreditation No. T-####',
      issued: '01 Jan 2024',
      valid: '31 Dec 2025',
      scope: 'Purity, Adulteration & Composition Testing — Ghee & Dairy',
    },
  },
  {
    id: 'a2',
    name: 'A2 Milk',
    sub: 'Certified',
    tagline: 'Genuine Gir cow A2 beta-casein',
    icon: Leaf,
    headerBg: 'from-[#1a3d28] to-[#2d6040]',
    sealColor: '#1a3d28',
    doc: {
      issuer: 'Certified Gir Cow Farm Network, India',
      issuerShort: 'A2 Milk Certification Board',
      number: 'Cert. No. A2/GIR/2024/####',
      issued: '20 Feb 2024',
      valid: '19 Feb 2026',
      scope: 'A2 β-Casein Verified Milk from Indigenous Gir Cow Breed',
    },
  },
]

// ─── Circular seal (SVG) ───────────────────────────────────────────────────────

function Seal({ icon: Icon, color }: { icon: LucideIcon; color: string }) {
  return (
    <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
        {/* Outer dashed ring */}
        <circle cx="32" cy="32" r="30" fill="none" stroke={color} strokeWidth="1" strokeDasharray="3 2" />
        {/* Inner ring */}
        <circle cx="32" cy="32" r="24" fill="none" stroke={color} strokeWidth="0.75" opacity="0.5" />
        {/* Fill */}
        <circle cx="32" cy="32" r="21" fill={color} opacity="0.08" />
        {/* Circular text */}
        <defs>
          <path id={`seal-text-${color}`} d="M32,6 A26,26 0 1,1 31.999,6" />
        </defs>
        <text fontSize="5.2" fill={color} fontWeight="700" letterSpacing="1.5">
          <textPath href={`#seal-text-${color}`} startOffset="2%">
            CERTIFIED • AAVYA FOODS • INDIA •
          </textPath>
        </text>
      </svg>
      {/* Icon in center */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor: color + '40', backgroundColor: color + '12' }}>
        <Icon className="w-4 h-4" style={{ color }} strokeWidth={1.5} />
      </div>
    </div>
  )
}

// ─── Card ──────────────────────────────────────────────────────────────────────

function CertCard({ cert }: { cert: Cert }) {
  const Icon = cert.icon

  return (
    <div
      className="flip-card w-full h-[370px] cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${cert.name} ${cert.sub}`}
      onKeyDown={(e) => e.key === 'Enter' && (e.currentTarget as HTMLElement).classList.toggle('is-flipped')}
    >
      <div className="flip-card-inner rounded-2xl" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.10))' }}>

        {/* ── FRONT ── */}
        <div className="flip-card-face flip-card-front flex flex-col items-center justify-between bg-[#FDFCF0] border border-primary/20 rounded-2xl p-6 overflow-hidden">
          {/* Top gold stripe */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-t-2xl" />

          {/* Animated badge */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-primary/50 animate-badge-spin" />
            <div className="absolute inset-[10px] rounded-full border border-primary/20" />
            <div className="absolute inset-[18px] rounded-full bg-secondary/8 border border-secondary/20 flex items-center justify-center">
              <Icon className="w-9 h-9 text-secondary" strokeWidth={1.5} />
            </div>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                <div className="absolute top-[3px] left-1/2 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-primary/60" />
              </div>
            ))}
          </div>

          {/* Label */}
          <div className="text-center">
            <p className="text-primary text-[10px] font-bold uppercase tracking-[0.22em] mb-0.5">{cert.sub}</p>
            <h3 className="text-text-primary font-extrabold text-2xl leading-tight">{cert.name}</h3>
            <p className="text-text-secondary/60 text-xs mt-2 leading-relaxed">{cert.tagline}</p>
          </div>

          {/* Hint */}
          <div className="flex items-center gap-2 text-secondary/35 text-[10px]">
            <span className="w-4 h-px bg-secondary/25" />
            hover to view certificate
            <span className="w-4 h-px bg-secondary/25" />
          </div>

          {/* Bottom green stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-secondary/0 via-secondary/40 to-secondary/0 rounded-b-2xl" />
        </div>

        {/* ── BACK: Certificate document ── */}
        <div className="flip-card-face flip-card-back rounded-2xl overflow-hidden flex flex-col bg-[#FEFDF8]">

          {/* Official header band */}
          <div className={`bg-gradient-to-r ${cert.headerBg} px-5 py-3.5 shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <Icon className="w-4.5 h-4.5 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white/50 text-[8px] uppercase tracking-[0.2em] leading-none mb-0.5">
                  {cert.doc.issuerShort}
                </p>
                <p className="text-white font-bold text-[13px] leading-tight">
                  {cert.name} {cert.sub}
                </p>
              </div>
            </div>
          </div>

          {/* Document body */}
          <div className="flex-1 flex flex-col px-5 py-4 relative overflow-hidden">

            {/* Faint watermark */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden
            >
              <p
                className="text-[56px] font-black uppercase tracking-widest opacity-[0.025] rotate-[-25deg] text-text-primary whitespace-nowrap"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                CERTIFIED
              </p>
            </div>

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-primary/25 rounded-tl-sm" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-primary/25 rounded-tr-sm" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-primary/25 rounded-bl-sm" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-primary/25 rounded-br-sm" />

            {/* Certificate title */}
            <div className="text-center mb-3 relative z-10">
              <p className="text-text-secondary/40 text-[8px] uppercase tracking-[0.25em] mb-0.5">
                Certificate of Compliance
              </p>
              <div className="flex items-center gap-1.5 justify-center">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/30" />
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/30" />
              </div>
            </div>

            {/* Main cert text */}
            <div className="text-center mb-3 relative z-10">
              <p className="text-text-secondary/50 text-[9px] mb-1">This is to certify that</p>
              <p className="text-text-primary font-extrabold text-[17px] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Aavya Foods
              </p>
              <p className="text-text-secondary/50 text-[9px] mt-1 mb-1.5">meets the requirements for</p>
              <p className="text-[11px] font-semibold text-text-primary/80 leading-snug px-2">
                {cert.doc.scope}
              </p>
            </div>

            {/* Details table */}
            <div className="space-y-1.5 text-[9px] border-t border-dashed border-primary/15 pt-2.5 relative z-10">
              {[
                ['Issuing Body', cert.doc.issuer],
                ['Certificate No.', cert.doc.number],
                ['Date of Issue', cert.doc.issued],
                ['Valid Until', cert.doc.valid],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <span className="text-text-secondary/45 shrink-0">{label}</span>
                  <span className="text-text-primary/70 font-medium text-right leading-tight">{value}</span>
                </div>
              ))}
            </div>

            {/* Footer: signature + seal */}
            <div className="flex items-end justify-between mt-auto pt-3 relative z-10">
              <div>
                <div className="h-px w-20 bg-text-primary/20 mb-1" />
                <p className="text-[8px] text-text-secondary/40">Authorised Signatory</p>
              </div>
              <Seal icon={Icon} color={cert.sealColor} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function CertificationsSection() {
  return (
    <section className="relative bg-[#FDFCF0] py-20 px-4 overflow-hidden">
      {/* Subtle green dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #2E7D32 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Heading */}
        <ScrollReveal animation="up">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-gradient-green" />
              <span className="text-gradient-green font-semibold text-xs uppercase tracking-[0.22em]">Verified Quality</span>
              <div className="h-px w-10 bg-gradient-green" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-3">
              Standards We Never Compromise On
            </h2>
            <p className="text-text-secondary text-sm max-w-sm mx-auto">
              Hover each card to view the official certificate.
            </p>
            <div className="w-14 h-[3px] bg-gradient-green rounded-full mx-auto mt-4" />
          </div>
        </ScrollReveal>

        {/* 3 cards in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CERTS.map((cert, i) => (
            <ScrollReveal key={cert.id} animation="up" delay={i * 100}>
              <CertCard cert={cert} />
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  )
}
