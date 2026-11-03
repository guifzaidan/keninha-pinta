import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { useMagnetic } from '../hooks'
import { useContent } from '../content-store'

const WING_UPPER = 'M58 46C44 14 10 4 8 26c-2 18 22 26 50 24z'
const WING_LOWER = 'M58 53C36 54 18 70 26 86c8 12 28-6 32-30z'

function Wing() {
  return (
    <>
      <path d={WING_UPPER} fill="var(--color-lilac)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      <path d={WING_LOWER} fill="var(--color-pink)" stroke="var(--color-ink)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="25" cy="25" r="7" fill="var(--color-gold)" stroke="var(--color-ink)" strokeWidth="2" />
    </>
  )
}

/** Brand butterfly (used in the logo). Gently flaps on hover of its parent `.group`. */
export function Butterfly({ className }: { className?: string }) {
  const flap = { transformBox: 'view-box', transformOrigin: '60px 50px' } as const
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <g className="group-hover:animate-flap" style={flap}>
        <Wing />
      </g>
      <g className="group-hover:animate-flap" style={flap}>
        <g transform="translate(120 0) scale(-1 1)">
          <Wing />
        </g>
      </g>
      <rect x="56" y="28" width="8" height="54" rx="4" fill="var(--color-ink)" />
    </svg>
  )
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

/** The single call-to-action used everywhere. Same label, same color, same destination. */
export function BuyButton({ className = '', children }: { className?: string; children?: ReactNode }) {
  const { links } = useContent()
  const ref = useMagnetic<HTMLAnchorElement>(0.22)
  return (
    <a ref={ref} href={links.checkoutUrl} className={`btn-buy group ${className}`}>
      {children ?? links.buyButton}
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  )
}

export function SectionTitle({ eyebrow, children, sub }: { eyebrow: string; children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="reveal mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">{children}</h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{sub}</p>}
    </div>
  )
}
