import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ─── Variants & sizes ────────────────────────────────────────────────────────

const variants = {
  /** Gradient green fill — primary call-to-action */
  primary: 'bg-gradient-green text-white hover:opacity-90 shadow-sm',
  /** Dark border, dark text — secondary action on dark/product pages */
  outline: 'border-2 border-text-primary text-text-primary hover:bg-surface',
  /** Subtle green border — tertiary / "Know More" style links */
  secondary: 'border border-secondary/30 text-secondary hover:bg-secondary/5',
  /** Muted border — ghost-like, e.g. "Go Back" */
  subtle: 'border border-surface text-text-secondary hover:border-secondary hover:text-secondary',
  /** Text only — minimal links, error states */
  ghost: 'text-secondary hover:text-secondary-light underline-offset-2 hover:underline',
} as const

const sizes = {
  sm: 'px-5 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

const BASE =
  'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ' +
  'active:scale-[0.98] motion-reduce:active:scale-100 disabled:opacity-50 disabled:pointer-events-none'

// ─── Props ────────────────────────────────────────────────────────────────────

type SharedProps = {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  className?: string
  children?: ReactNode
}

type ButtonProps =
  | ({ href: string } & SharedProps & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>)
  | ({ href?: undefined } & SharedProps & Omit<ComponentProps<'button'>, 'className' | 'children'>)

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified button component.
 * Pass `href` to render a Next.js `<Link>`, omit it for a `<button>`.
 *
 * @example
 * <Button href="/products" rightIcon={<ArrowRight className="w-4 h-4" />}>
 *   View all
 * </Button>
 *
 * <Button variant="outline" onClick={handleClick} leftIcon={<ShoppingCart className="w-4 h-4" />}>
 *   Add to cart
 * </Button>
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn(BASE, variants[variant], sizes[size], fullWidth && 'w-full', className)

  if (href !== undefined) {
    const linkRest = rest as Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>
    return (
      <Link href={href} className={classes} {...linkRest}>
        {leftIcon}
        {children}
        {rightIcon}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as ComponentProps<'button'>)}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
