import { Check, Lock } from 'lucide-react'
import { useContent } from '../content-store'
import { Sunburst, Tilt } from './interactive'
import { BuyButton } from './ui'

export function Offer() {
  const { course, offer } = useContent()
  return (
    <section id="oferta" className="relative isolate overflow-hidden px-4 py-24 sm:px-6 sm:py-28">
      <Sunburst a="#e9ddfb" b="#f6f1fd" />
      <div className="reveal mx-auto max-w-lg">
        <Tilt max={5} glare={false} className="rounded-[2rem] border-2 border-ink bg-paper p-8 shadow-[8px_8px_0_0_var(--color-ink)] sm:p-10">
          <p className="eyebrow text-center">{offer.eyebrow}</p>
          <h2 className="font-display mt-3 text-center text-3xl font-extrabold sm:text-4xl">{course.name}</h2>

          <div className="mt-6 text-center">
            <p className="flex items-start justify-center gap-1.5">
              <span className="mt-3 text-xl font-semibold text-ink-soft">R$</span>
              <span className="font-display text-7xl leading-none font-extrabold tracking-tight">{course.price}</span>
            </p>
            <p className="mt-2 text-sm text-ink-soft">{course.priceNote}</p>
          </div>

          <BuyButton className="mt-8 w-full px-6 py-4 text-base" />
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <Lock className="h-3.5 w-3.5" /> {offer.secureNote}
          </p>

          <ul className="mt-8 space-y-3.5 border-t border-line pt-8">
            {offer.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink" strokeWidth={2.5} />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </Tilt>
      </div>
    </section>
  )
}
