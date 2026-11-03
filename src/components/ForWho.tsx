import { Check } from 'lucide-react'
import type { CSSProperties } from 'react'
import { FOR_WHO } from '../content'
import { SectionTitle } from './ui'

export function ForWho() {
  return (
    <section className="bg-paper px-4 py-24 sm:px-6 sm:py-28">
      <SectionTitle eyebrow="Para quem é">É para você que…</SectionTitle>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
        {FOR_WHO.map((c, i) => (
          <div
            key={c.title}
            className="reveal flex gap-4 rounded-[1.5rem] bg-cream p-6"
            style={{ '--delay': `${i * 60}ms` } as CSSProperties}
          >
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-pink text-white">
              <Check className="h-4 w-4" strokeWidth={3} />
            </span>
            <div>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 leading-relaxed text-ink-soft">{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
