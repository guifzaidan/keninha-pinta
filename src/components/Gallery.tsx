import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { GalleryItem } from '../content'
import { prefersReducedMotion } from '../hooks'
import { useContent } from '../content-store'
import { Tilt } from './interactive'
import { SectionTitle } from './ui'

const AUTO_SPEED = 45 // px per second
const COPIES = 3 // [clone][real][clone] so we can wrap seamlessly in both directions
export function Gallery() {
  const { gallery } = useContent()
  const items = gallery.items
  const loop = useMemo(
    () => Array.from({ length: COPIES }, (_, c) => items.map((p, i) => ({ ...p, i, clone: c !== 1 }))).flat(),
    [items],
  )
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)

  // Motion state lives in a ref so the animation loop never re-renders React
  const m = useRef({
    pos: 0, // current offset (px)
    setW: 0, // width of one full copy of the gallery
    speed: 0, // current auto speed (eases toward the target speed)
    paused: false, // lightbox open
    visible: false,
    drag: { active: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, moved: 0 },
    fling: 0, // inertia after a drag (px/s)
  })

  // Animation loop
  useEffect(() => {
    const vp = viewport.current
    const tr = track.current
    if (!vp || !tr) return
    const s = m.current
    const base = prefersReducedMotion() ? 0 : AUTO_SPEED
    // Only real mouse users pause on hover (touch devices keep a sticky :hover after a tap)
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const measure = () => {
      const first = tr.children[0] as HTMLElement | undefined
      const second = tr.children[items.length] as HTMLElement | undefined
      if (!first || !second) return
      const old = s.setW
      s.setW = second.offsetLeft - first.offsetLeft
      // keep the same relative spot when the layout changes
      s.pos = old ? s.setW + ((s.pos - old) / old) * s.setW : s.setW
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(tr)

    const io = new IntersectionObserver(([e]) => (s.visible = e.isIntersecting))
    io.observe(vp)

    let raf = 0
    let last = performance.now()
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now

      if (!s.drag.active && s.visible) {
        const hovered = mouse && vp.matches(':hover')
        const goal = hovered || s.paused ? 0 : base
        s.speed += (goal - s.speed) * Math.min(1, dt * 4) // smooth slow-down / speed-up
        s.pos += (s.speed + s.fling) * dt
        s.fling *= Math.pow(0.04, dt) // inertia decays
        if (Math.abs(s.fling) < 1) s.fling = 0
      }

      // Seamless wrap: always stay inside the middle copy
      if (s.setW > 0) {
        while (s.pos >= s.setW * 2) {
          s.pos -= s.setW
          s.drag.startPos -= s.setW
        }
        while (s.pos < s.setW) {
          s.pos += s.setW
          s.drag.startPos += s.setW
        }
      }
      tr.style.transform = `translate3d(${(-s.pos).toFixed(2)}px, 0, 0)`
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [items.length])

  useEffect(() => {
    m.current.paused = open !== null
  }, [open])

  // Drag / swipe (mouse + touch). Listeners go on window so clicks on cards still work.
  useEffect(() => {
    const vp = viewport.current
    if (!vp) return
    const s = m.current

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
      s.drag = { active: true, startX: e.clientX, startPos: s.pos, lastX: e.clientX, lastT: performance.now(), moved: 0 }
      s.fling = 0
      vp.classList.add('cursor-grabbing')
    }
    const onMove = (e: PointerEvent) => {
      if (!s.drag.active) return
      const dx = e.clientX - s.drag.startX
      s.drag.moved = Math.max(s.drag.moved, Math.abs(dx))
      s.pos = s.drag.startPos - dx
      const now = performance.now()
      const dt = (now - s.drag.lastT) / 1000
      if (dt > 0) s.fling = (-(e.clientX - s.drag.lastX) / dt) * 0.6
      s.drag.lastX = e.clientX
      s.drag.lastT = now
    }
    const onUp = () => {
      if (!s.drag.active) return
      s.drag.active = false
      if (performance.now() - s.drag.lastT > 80) s.fling = 0 // held still before letting go
      s.fling = Math.max(-2500, Math.min(2500, s.fling))
      vp.classList.remove('cursor-grabbing')
    }

    vp.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      vp.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [])

  return (
    <section id="galeria" className="overflow-hidden bg-paper py-24 sm:py-28">
      <div className="px-4 sm:px-6">
        <SectionTitle eyebrow={gallery.eyebrow} sub={gallery.sub}>
          {gallery.title}
        </SectionTitle>
      </div>

      <div
        ref={viewport}
        className="mt-12 cursor-grab touch-pan-y overflow-hidden select-none"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
        }}
        aria-roledescription="carrossel"
        aria-label="Pinturas da Keninha"
      >
        <div ref={track} className="flex gap-5 py-3 will-change-transform">
          {loop.map((p, k) => (
            <button
              key={k}
              type="button"
              tabIndex={p.clone ? -1 : 0}
              aria-hidden={p.clone || undefined}
              onClick={(e) => (e.detail === 0 || m.current.drag.moved < 6) && setOpen(p.i)}
              className="group w-[66%] shrink-0 text-left sm:w-[38%] lg:w-[26%] xl:w-[20%]"
              aria-label={`Ampliar: ${p.title}`}
            >
              <Tilt max={10} className="overflow-hidden rounded-[1.5rem]">
                <img
                  src={p.src}
                  alt={`Pintura facial: ${p.title}`}
                  loading="lazy"
                  draggable={false}
                  width={900}
                  height={1200}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <PaintSticker
                  title={p.title}
                  color={p.color}
                  dark={p.dark}
                  tilt={p.i % 2 ? 2.5 : -3}
                  className="pointer-events-none absolute bottom-4 left-4"
                />
              </Tilt>
            </button>
          ))}
        </div>
      </div>

      {open !== null && items[open] && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
    </section>
  )
}

/** Retro sticker with the painting's name, in its main paint color. */
function PaintSticker({ title, color, dark, tilt = 0, className = '' }: { title: string; color: string; dark?: boolean; tilt?: number; className?: string }) {
  return (
    <span
      className={`font-display inline-block rounded-xl border-2 border-ink px-3.5 py-1.5 text-base leading-tight font-bold shadow-[3px_3px_0_0_var(--color-ink)] rotate-(--r) transition-all duration-300 group-hover:rotate-0 group-hover:-translate-y-0.5 ${dark ? 'text-ink' : 'text-white'} ${className}`}
      style={{ background: color, '--r': `${tilt}deg` } as CSSProperties}
    >
      {title}
    </span>
  )
}

function Lightbox({ items, index, onClose, onChange }: { items: GalleryItem[]; index: number; onClose: () => void; onChange: (i: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const total = items.length
  const go = useCallback((d: number) => onChange((index + d + total) % total), [index, onChange, total])

  useEffect(() => {
    const el = dialog.current
    if (el && !el.open) el.showModal()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const p = items[index]
  const btn = 'absolute grid h-11 w-11 place-items-center rounded-full bg-paper shadow-lg transition-transform hover:scale-105'
  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(e) => e.target === dialog.current && onClose()}
      className="m-auto max-h-[92vh] w-[min(90vw,28rem)] overflow-visible bg-transparent p-0 backdrop:bg-ink/80 backdrop:backdrop-blur-sm"
      aria-label={p.title}
    >
      <figure className="overflow-hidden rounded-[1.5rem] bg-paper">
        <img key={p.src} src={p.src} alt={`Pintura facial: ${p.title}`} className="max-h-[78vh] w-full object-cover" />
        <figcaption className="flex items-center justify-between px-5 py-4 text-sm">
          <PaintSticker title={p.title} color={p.color} dark={p.dark} />
          <span className="text-ink-soft">
            {index + 1} / {total}
          </span>
        </figcaption>
      </figure>
      <button type="button" onClick={onClose} className={`${btn} -top-4 -right-4`} aria-label="Fechar">
        <X className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => go(-1)} className={`${btn} top-1/2 -left-5 -translate-y-1/2`} aria-label="Anterior">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => go(1)} className={`${btn} top-1/2 -right-5 -translate-y-1/2`} aria-label="Próxima">
        <ChevronRight className="h-5 w-5" />
      </button>
    </dialog>
  )
}
