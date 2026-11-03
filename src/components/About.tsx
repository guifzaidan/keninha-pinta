import { INSTAGRAM, PHOTOS } from '../content'
import { InstagramIcon } from './ui'

export function About() {
  return (
    <section id="keninha" className="px-4 py-24 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[0.8fr_1fr] md:gap-16">
        <img
          src={PHOTOS.about}
          alt="Kênia Laís, a Keninha, com uma pintura de unicórnio no rosto"
          loading="lazy"
          width={900}
          height={1200}
          className="reveal mx-auto aspect-[4/5] w-full max-w-sm rounded-[2rem] object-cover"
        />

        <div className="reveal [--delay:100ms]">
          <p className="eyebrow">Quem vai te ensinar</p>
          <h2 className="font-display mt-4 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl">
            Prazer, eu sou a <span className="text-pink">Keninha</span>
          </h2>

          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
            <p>
              Sou a Kênia Laís e transformo rostos em borboletas, bichinhos e personagens usando pincel, tinta e muito
              glitter.
            </p>
            <p>
              No Descomplica Borboleta, juntei o caminho que faz sentido para quem está começando: o que comprar, o que
              treinar primeiro e como chegar nas primeiras pinturas completas. Tudo explicado com calma e bom humor.
            </p>
          </div>

          <a href={INSTAGRAM.url} target="_blank" rel="noreferrer noopener" className="link-soft mt-8 text-sm">
            <InstagramIcon className="h-4 w-4" /> Acompanhe no Instagram {INSTAGRAM.handle}
          </a>
        </div>
      </div>
    </section>
  )
}
