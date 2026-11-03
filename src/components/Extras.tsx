import { useEffect, useState } from 'react'
import { whatsappUrl } from '../content'
import { useContent } from '../content-store'
import { WhatsAppIcon } from './ui'

/** True after the hero, except while the offer box is on screen. */
function useStickyCtaVisible() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const offer = document.getElementById('oferta')
    let offerVisible = false
    const update = () => setShow(window.scrollY > window.innerHeight * 0.9 && !offerVisible)
    const io = new IntersectionObserver(([e]) => {
      offerVisible = e.isIntersecting
      update()
    })
    if (offer) io.observe(offer)
    window.addEventListener('scroll', update, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return show
}

/** Mobile bottom bar + WhatsApp bubble (which lifts above the bar on mobile while it's showing). */
export function FloatingActions() {
  const show = useStickyCtaVisible()
  const { course, links } = useContent()

  return (
    <>
      <a
        href={whatsappUrl(links.whatsapp, links.whatsappMessage)}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Fale com a gente no WhatsApp"
        title="Fale com a gente no WhatsApp"
        className={`fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-110 hover:bg-[#1ebe5b] sm:right-6 sm:bottom-6 ${
          show ? 'bottom-24' : 'bottom-4'
        }`}
      >
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 sm:hidden ${
          show ? 'translate-y-0' : 'pointer-events-none translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="leading-tight">
            <p className="text-xs text-ink-soft">{course.name}</p>
            <p className="text-lg font-bold">R$ {course.price}</p>
          </div>
          <a href={links.checkoutUrl} className="btn-buy px-5 py-3 text-sm whitespace-nowrap">
            {links.buyButton}
          </a>
        </div>
      </div>
    </>
  )
}
