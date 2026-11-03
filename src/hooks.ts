import { useEffect, useRef, useState } from 'react'

/** Adds `.is-visible` to every `.reveal` element once it scrolls into view. */
export function useRevealOnScroll() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export function useScrollY(threshold: number) {
  const [past, setPast] = useState(false)
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return past
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True for a real mouse/trackpad user who hasn't asked for reduced motion. */
export function canHover() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !prefersReducedMotion()
  )
}

/** Pulls an element slightly toward the cursor while hovered. Mouse only. */
export function useMagnetic<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !canHover()) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) * strength
      const dy = (e.clientY - (r.top + r.height / 2)) * strength
      el.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`
    }
    const onLeave = () => {
      el.style.translate = ''
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength])
  return ref
}
