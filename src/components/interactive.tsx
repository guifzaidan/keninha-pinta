import { useEffect, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { canHover, prefersReducedMotion } from '../hooks'

/**
 * Rotating sunburst background. It lives inside a `relative isolate overflow-hidden` section and:
 *  - spins slowly on its own,
 *  - gets a small spin boost from sweeping the mouse sideways (page scroll does NOT affect it),
 *  - drifts its center toward the cursor.
 * It also exposes --mx / --my (0..1) on the host section for other effects to use.
 */
export function Sunburst({ a, b, className = '' }: { a: string; b: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host || prefersReducedMotion()) return

    let angle = 0
    let boost = 0
    let ox = 0
    let oy = 0
    let tx = 0
    let ty = 0
    let lastX: number | null = null
    let raf = 0
    let visible = false

    const frame = () => {
      raf = 0
      if (!visible) return
      boost = Math.max(-4, Math.min(4, boost)) * 0.93
      angle += 0.035 + boost
      ox += (tx - ox) * 0.05
      oy += (ty - oy) * 0.05
      el.style.transform = `translate(-50%, -50%) translate(${ox.toFixed(1)}px, ${oy.toFixed(1)}px) rotate(${angle.toFixed(2)}deg)`
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !raf) {
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(host)

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = host.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      tx = (x - 0.5) * 180
      ty = (y - 0.5) * 140
      if (lastX !== null) boost += (e.clientX - lastX) * 0.006
      lastX = e.clientX
      host.style.setProperty('--mx', x.toFixed(3))
      host.style.setProperty('--my', y.toFixed(3))
    }
    const onLeave = () => {
      tx = 0
      ty = 0
      lastX = null
    }
    host.addEventListener('pointermove', onMove)
    host.addEventListener('pointerleave', onLeave)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`sunburst pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[260vmax] w-[260vmax] ${className}`}
      style={
        {
          '--sun-a': a,
          '--sun-b': b,
          transform: 'translate(-50%, -50%)',
          maskImage: 'radial-gradient(circle, black 8%, transparent 27%)',
          WebkitMaskImage: 'radial-gradient(circle, black 8%, transparent 27%)',
        } as CSSProperties
      }
    />
  )
}

/** 3D tilt that follows the cursor, with a soft light glare. Mouse only. */
export function Tilt({
  children,
  className = '',
  max = 8,
  glare = true,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !canHover()) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${((0.5 - y) * max).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${((x - 0.5) * max).toFixed(2)}deg`)
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
      })
    }
    const onEnter = () => el.classList.add('is-tilting')
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.classList.remove('is-tilting')
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max])

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  )
}
