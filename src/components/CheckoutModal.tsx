import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useContent } from '../content-store'

/**
 * On tablets and desktops, any link to the Hotmart checkout opens it in a modal over the page,
 * using Hotmart's embedded mode (?checkoutMode=2, the same one their widget uses).
 * On phones, and for ctrl/cmd-clicks, the link just navigates like a normal link.
 */
export function CheckoutModal() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [src, setSrc] = useState<string>()
  const checkoutUrl = useContent().links.checkoutUrl

  useEffect(() => {
    let checkoutOrigin: string
    try {
      checkoutOrigin = new URL(checkoutUrl).origin
    } catch {
      return
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = (e.target as Element | null)?.closest?.('a[href]')
      if (!(link instanceof HTMLAnchorElement) || link.origin !== checkoutOrigin) return
      if (!window.matchMedia('(min-width: 640px)').matches) return

      e.preventDefault()
      const url = new URL(link.href)
      url.searchParams.set('checkoutMode', '2')
      // Keep the iframe (and anything already typed) if the same checkout is reopened
      setSrc((prev) => (prev === url.href ? prev : url.href))
      dialog.current?.showModal()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [checkoutUrl])

  return (
    <dialog
      ref={dialog}
      aria-label="Finalizar compra"
      // Clicking the backdrop (the dialog element itself, outside the panel) closes it
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
      className="m-auto h-[min(90vh,860px)] w-[min(92vw,620px)] overflow-visible rounded-3xl border-2 border-ink bg-paper p-0 shadow-[6px_6px_0_0_var(--color-ink)] backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="h-full w-full overflow-hidden rounded-[22px]">
        {src && <iframe src={src} title="Pagamento seguro pela Hotmart" allow="payment" className="h-full w-full" />}
      </div>
      <button
        type="button"
        onClick={() => dialog.current?.close()}
        aria-label="Fechar pagamento"
        className="absolute -top-4 -right-4 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-paper shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:scale-110"
      >
        <X className="h-5 w-5" />
      </button>
    </dialog>
  )
}
