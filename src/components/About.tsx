import { useContent } from '../content-store'
import { Rich } from '../site-content'
import { InstagramIcon } from './ui'

export function About() {
  const { about, links } = useContent()
  return (
    <section id="keninha" className="px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[0.8fr_1fr] md:gap-16">
        <img
          src={about.image}
          alt={about.imageAlt}
          loading="lazy"
          width={900}
          height={1200}
          className="reveal mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] object-cover"
        />

        <div className="reveal [--delay:100ms]">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            <Rich text={about.title} wrap={(t) => <span className="text-pink">{t}</span>} />
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            {about.paragraphs.map((p, i) => (
              <p key={i}>
                <Rich text={p} wrap={(t) => <strong className="font-semibold text-ink">{t}</strong>} />
              </p>
            ))}
          </div>

          <a href={links.instagramUrl} target="_blank" rel="noreferrer noopener" className="link-soft mt-8 text-sm">
            <InstagramIcon className="h-4 w-4" /> {about.instagramText} {links.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  )
}
