import type { CSSProperties } from 'react'
import { TESTIMONIALS } from '../content'
import { Tilt } from './interactive'
import { SectionTitle } from './ui'

export function Testimonials() {
  return (
    <section id="depoimentos" className="bg-blush px-4 py-24 sm:px-6 sm:py-28">
      <SectionTitle eyebrow="Depoimentos">Quem aprendeu, recomenda</SectionTitle>

      <div className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="reveal" style={{ '--delay': `${i * 80}ms` } as CSSProperties}>
            <Tilt max={7} className="card h-full border-transparent">
              <figure className="flex h-full flex-col justify-between p-7">
                <span className="font-display text-5xl leading-none text-pink" aria-hidden="true">
                  “
                </span>
                <blockquote className="mt-2 flex-1 text-lg leading-relaxed">{t}</blockquote>
                <figcaption className="mt-6 text-sm font-medium text-ink-soft">Aluna do Descomplica Borboleta</figcaption>
              </figure>
            </Tilt>
          </div>
        ))}
      </div>
    </section>
  )
}
