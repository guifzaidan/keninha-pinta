import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { JOURNEY } from '../content'
import { SectionTitle } from './ui'

export function Journey() {
  const list = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  // The line fills in as you scroll through the steps
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = list.current
      if (!el || !fill.current) return
      const r = el.getBoundingClientRect()
      const anchor = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (anchor - r.top) / r.height))
      fill.current.style.transform = `scaleY(${p})`
      // Light up each step number once the line reaches it
      el.querySelectorAll<HTMLElement>('[data-step]').forEach((dot) => {
        dot.classList.toggle('is-on', dot.getBoundingClientRect().top + 20 < anchor)
      })
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="o-curso" className="px-4 py-24 sm:px-6 sm:py-28">
      <SectionTitle eyebrow="O curso" sub="Cada etapa se apoia na anterior, para você nunca se sentir perdida.">
        O caminho, passo a passo
      </SectionTitle>

      <div ref={list} className="relative mx-auto mt-16 max-w-2xl">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-5 w-0.5 -translate-x-1/2 bg-line">
          <div ref={fill} className="h-full w-full origin-top bg-pink" style={{ transform: 'scaleY(0)' }} />
        </div>

        <ol className="space-y-10">
          {JOURNEY.map((s, i) => (
            <li
              key={s.title}
              className="reveal group relative grid grid-cols-[2.5rem_1fr] gap-5 sm:gap-7"
              style={{ '--delay': '40ms' } as CSSProperties}
            >
              <span
                data-step
                className="relative z-10 grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-sm font-bold transition-all duration-500 [&.is-on]:scale-110 [&.is-on]:border-pink [&.is-on]:bg-pink [&.is-on]:text-white"
              >
                {i + 1}
              </span>
              <div className="pt-1.5">
                <h3 className="font-display text-xl font-bold transition-colors group-hover:text-pink sm:text-2xl">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
