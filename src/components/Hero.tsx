import { Check } from 'lucide-react'
import { COURSE, HIGHLIGHTS, PHOTOS } from '../content'
import { Sunburst, Tilt } from './interactive'
import { BuyButton } from './ui'

export function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-32 lg:pt-36 lg:pb-28">
      <Sunburst a="#f7d9e6" b="#fbf6f0" />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <p className="reveal eyebrow">Curso online de pintura facial</p>

          <h1 className="reveal font-display mt-5 text-[2.5rem] leading-[1.05] font-extrabold tracking-tight [--delay:60ms] sm:text-6xl">
            Aprenda <span className="text-shift">pintura facial</span> do zero, no seu ritmo
          </h1>

          <p className="reveal mx-auto mt-6 max-w-lg text-lg leading-relaxed text-ink-soft [--delay:120ms] lg:mx-0">
            No <strong className="font-semibold text-ink">{COURSE.name}</strong>, a Keninha te ensina passo a passo,
            dos materiais certos às primeiras pinturas completas, mesmo que você ache que não sabe desenhar.
          </p>

          <div className="reveal mt-9 flex flex-col items-center gap-5 [--delay:180ms] sm:flex-row sm:justify-center lg:justify-start">
            <BuyButton className="w-full px-8 py-4 text-base sm:w-auto" />
            <a href="#o-curso" className="link-soft text-sm">
              Ver o que vou aprender
            </a>
          </div>

          <ul className="reveal mt-9 flex flex-col items-center gap-2.5 text-sm text-ink-soft [--delay:240ms] sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 lg:justify-start">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-pink" strokeWidth={3} />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal mx-auto w-full max-w-sm [--delay:120ms] lg:max-w-md">
          <Tilt max={12} className="rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(43,24,56,0.5)]">
            <img
              src={PHOTOS.hero}
              alt="Keninha com uma pintura facial de borboleta azul no rosto"
              width={900}
              height={1200}
              fetchPriority="high"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover object-top"
            />
          </Tilt>
        </div>
      </div>
    </section>
  )
}
