import { Plus } from 'lucide-react'
import { useState } from 'react'
import { FAQ, INSTAGRAM } from '../content'
import { BuyButton, SectionTitle } from './ui'

export function Faq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="duvidas" className="px-4 py-24 sm:px-6 sm:py-28">
      <SectionTitle eyebrow="Dúvidas">Perguntas frequentes</SectionTitle>

      <div className="reveal mx-auto mt-12 max-w-2xl divide-y divide-line border-y border-line">
        {FAQ.map((f, i) => {
          const isOpen = open === i
          const id = `faq-${i}`
          return (
            <div key={f.q}>
              <h3>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={id}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="text-lg font-medium">{f.q}</span>
                  <Plus
                    className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-pink' : 'text-ink-soft'}`}
                  />
                </button>
              </h3>
              <div
                id={id}
                role="region"
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="pr-10 pb-6 leading-relaxed text-ink-soft">{f.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="reveal mx-auto mt-14 max-w-2xl text-center">
        <BuyButton className="px-8 py-4 text-base" />
        <p className="mt-6 text-sm text-ink-soft">
          Ainda com dúvida? Fale comigo no Instagram{' '}
          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer noopener" className="font-semibold text-ink underline underline-offset-4">
            {INSTAGRAM.handle}
          </a>
        </p>
      </div>
    </section>
  )
}
