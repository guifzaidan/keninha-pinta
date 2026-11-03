import { useContent } from '../content-store'
import { Logo } from './Header'
import { InstagramIcon } from './ui'

const YEAR = new Date().getFullYear()

export function Footer() {
  const { links } = useContent()
  return (
    <footer className="border-t border-line px-4 pt-12 pb-28 sm:px-6 sm:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-ink-soft md:flex-row">
        <Logo />
        <a href={links.instagramUrl} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 hover:text-ink">
          <InstagramIcon className="h-4 w-4" /> {links.instagramHandle}
        </a>
        <p>© {YEAR} Keninha Pinta</p>
      </div>
    </footer>
  )
}
