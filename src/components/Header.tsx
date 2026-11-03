import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useScrollY } from '../hooks'
import { Butterfly, BuyButton } from './ui'

const LINKS = [
  { href: '#galeria', label: 'Pinturas' },
  { href: '#o-curso', label: 'O curso' },
  { href: '#keninha', label: 'Sobre a Keninha' },
  { href: '#duvidas', label: 'Dúvidas' },
]

export function Logo() {
  return (
    <a href="#topo" className="group inline-flex items-center gap-2" aria-label="Keninha Pinta, voltar ao início">
      <Butterfly className="h-8 w-9" />
      <span className="font-display text-xl font-extrabold tracking-tight">
        Keninha <span className="text-pink">Pinta</span>
      </span>
    </a>
  )
}

export function Header() {
  const scrolled = useScrollY(16)
  const [open, setOpen] = useState(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-cream/95 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Seções">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-soft transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BuyButton className="hidden px-5 py-2.5 text-sm sm:inline-flex" />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        id="menu-mobile"
        className={`grid transition-all duration-300 lg:hidden ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        aria-label="Seções"
      >
        <div className="overflow-hidden">
          <div className="flex flex-col px-4 pb-6">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 text-lg font-medium last:border-0"
              >
                {l.label}
              </a>
            ))}
            <div onClick={() => setOpen(false)} className="mt-4">
              <BuyButton className="w-full px-5 py-4" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
