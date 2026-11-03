import {
  BadgeCheck,
  CircleHelp,
  Footprints,
  Heart,
  Images,
  Link2,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { SiteContent } from '../content'

/** Describes the admin form. Each field's `key` is a property of its section (or list item) in SiteContent. */
export type Field =
  | { kind: 'text'; key: string; label: string; hint?: string; long?: boolean; placeholder?: string }
  | { kind: 'image'; key: string; label: string; hint?: string }
  | { kind: 'color'; key: string; label: string; hint?: string }
  | { kind: 'bool'; key: string; label: string }
  | ListField

export type ListField = {
  kind: 'list'
  key: string
  label: string
  hint?: string
  itemName: string
  /** 'text' / 'long' for a list of strings, or the fields of each item */
  item: 'text' | 'long' | Field[]
  empty: unknown
  /** How object items are shown: a grid of photo cards, or cards that open and close */
  layout?: 'grid' | 'accordion'
  /** Item property shown as the card title (accordion) */
  titleKey?: string
}

export type Group = { title: string; description?: string; fields: Field[] }

export type Section = {
  id: keyof SiteContent
  title: string
  description: string
  icon: LucideIcon
  /** Anchor of this part on the site, for "Ver no site" */
  anchor?: string
  groups: Group[]
}

const HIGHLIGHT = 'Coloque *entre asteriscos* a parte que deve aparecer destacada.'
const EYEBROW: Field = { kind: 'text', key: 'eyebrow', label: 'Frase pequena acima do título', hint: 'Aparece em letras maiúsculas, em rosa.' }

export const SECTIONS: Section[] = [
  {
    id: 'hero',
    title: 'Topo da página',
    description: 'A primeira coisa que as pessoas veem ao abrir o site.',
    icon: Sparkles,
    anchor: 'topo',
    groups: [
      {
        title: 'Textos',
        fields: [
          EYEBROW,
          { kind: 'text', key: 'title', label: 'Título principal', hint: HIGHLIGHT },
          { kind: 'text', key: 'text', label: 'Texto abaixo do título', long: true, hint: HIGHLIGHT },
          { kind: 'text', key: 'secondaryLink', label: 'Link ao lado do botão de compra' },
        ],
      },
      {
        title: 'Destaques',
        description: 'Frases curtas com ✓ logo abaixo do botão.',
        fields: [{ kind: 'list', key: 'highlights', label: 'Destaques', itemName: 'destaque', item: 'text', empty: '' }],
      },
      {
        title: 'Foto',
        fields: [
          { kind: 'image', key: 'image', label: 'Foto do topo' },
          { kind: 'text', key: 'imageAlt', label: 'Descrição da foto', hint: 'Lida por leitores de tela e pelo Google. Descreva o que aparece na foto.' },
        ],
      },
    ],
  },
  {
    id: 'gallery',
    title: 'Galeria',
    description: 'O carrossel com as fotos das pinturas.',
    icon: Images,
    anchor: 'galeria',
    groups: [
      {
        title: 'Textos',
        fields: [
          EYEBROW,
          { kind: 'text', key: 'title', label: 'Título' },
          { kind: 'text', key: 'sub', label: 'Subtítulo', long: true },
        ],
      },
      {
        title: 'Pinturas',
        description: 'Aparecem nesta ordem no carrossel. A etiqueta colorida fica sobre a foto.',
        fields: [
          {
            kind: 'list',
            key: 'items',
            label: 'Pinturas',
            itemName: 'pintura',
            layout: 'grid',
            item: [
              { kind: 'image', key: 'src', label: 'Foto' },
              { kind: 'text', key: 'title', label: 'Nome da pintura' },
              { kind: 'color', key: 'color', label: 'Cor da etiqueta' },
              { kind: 'bool', key: 'dark', label: 'Texto escuro (para cores claras)' },
            ],
            empty: { src: '', title: 'Nova pintura', color: '#e9488f', dark: false },
          },
        ],
      },
    ],
  },
  {
    id: 'journey',
    title: 'O curso',
    description: 'As etapas do curso, passo a passo.',
    icon: Footprints,
    anchor: 'o-curso',
    groups: [
      {
        title: 'Textos',
        fields: [
          EYEBROW,
          { kind: 'text', key: 'title', label: 'Título' },
          { kind: 'text', key: 'sub', label: 'Subtítulo', long: true },
        ],
      },
      {
        title: 'Etapas',
        description: 'Numeradas automaticamente, na ordem abaixo.',
        fields: [
          {
            kind: 'list',
            key: 'items',
            label: 'Etapas',
            itemName: 'etapa',
            layout: 'accordion',
            titleKey: 'title',
            item: [
              { kind: 'text', key: 'title', label: 'Título da etapa' },
              { kind: 'text', key: 'text', label: 'Descrição', long: true },
            ],
            empty: { title: '', text: '' },
          },
        ],
      },
    ],
  },
  {
    id: 'forWho',
    title: 'Para quem é',
    description: 'Os cartões com ✓ que mostram para quem é o curso.',
    icon: Heart,
    groups: [
      {
        title: 'Textos',
        fields: [EYEBROW, { kind: 'text', key: 'title', label: 'Título' }],
      },
      {
        title: 'Cartões',
        fields: [
          {
            kind: 'list',
            key: 'items',
            label: 'Cartões',
            itemName: 'cartão',
            layout: 'accordion',
            titleKey: 'title',
            item: [
              { kind: 'text', key: 'title', label: 'Título do cartão' },
              { kind: 'text', key: 'text', label: 'Texto', long: true },
            ],
            empty: { title: '', text: '' },
          },
        ],
      },
    ],
  },
  {
    id: 'about',
    title: 'Sobre a Keninha',
    description: 'Sua apresentação, com foto.',
    icon: UserRound,
    anchor: 'keninha',
    groups: [
      {
        title: 'Textos',
        fields: [
          EYEBROW,
          { kind: 'text', key: 'title', label: 'Título', hint: HIGHLIGHT },
          { kind: 'list', key: 'paragraphs', label: 'Parágrafos', hint: HIGHLIGHT, itemName: 'parágrafo', item: 'long', empty: '' },
          { kind: 'text', key: 'instagramText', label: 'Texto do link do Instagram', hint: 'O @ do Instagram aparece logo depois.' },
        ],
      },
      {
        title: 'Foto',
        fields: [
          { kind: 'image', key: 'image', label: 'Sua foto' },
          { kind: 'text', key: 'imageAlt', label: 'Descrição da foto', hint: 'Lida por leitores de tela e pelo Google.' },
        ],
      },
    ],
  },
  {
    id: 'course',
    title: 'Curso e preço',
    description: 'Usados no quadro de oferta e na barra de compra do celular.',
    icon: Tag,
    anchor: 'oferta',
    groups: [
      {
        title: 'Curso',
        fields: [
          { kind: 'text', key: 'name', label: 'Nome do curso' },
          { kind: 'text', key: 'price', label: 'Preço', hint: 'Só o número, sem "R$".', placeholder: '99,90' },
          { kind: 'text', key: 'priceNote', label: 'Frase abaixo do preço' },
        ],
      },
    ],
  },
  {
    id: 'offer',
    title: 'Quadro de oferta',
    description: 'O quadro com o preço e o que está incluído.',
    icon: BadgeCheck,
    anchor: 'oferta',
    groups: [
      {
        title: 'Textos',
        fields: [
          { kind: 'text', key: 'eyebrow', label: 'Frase acima do nome do curso' },
          { kind: 'text', key: 'secureNote', label: 'Frase abaixo do botão' },
        ],
      },
      {
        title: 'O que está incluído',
        description: 'Cada item aparece com um ✓.',
        fields: [{ kind: 'list', key: 'items', label: 'Itens', itemName: 'item', item: 'text', empty: '' }],
      },
    ],
  },
  {
    id: 'faq',
    title: 'Perguntas frequentes',
    description: 'As dúvidas mais comuns, com as respostas.',
    icon: CircleHelp,
    anchor: 'duvidas',
    groups: [
      {
        title: 'Textos',
        fields: [
          EYEBROW,
          { kind: 'text', key: 'title', label: 'Título' },
          { kind: 'text', key: 'footer', label: 'Frase no final', hint: 'O @ do Instagram aparece logo depois.' },
        ],
      },
      {
        title: 'Perguntas',
        fields: [
          {
            kind: 'list',
            key: 'items',
            label: 'Perguntas',
            itemName: 'pergunta',
            layout: 'accordion',
            titleKey: 'title',
            item: [
              { kind: 'text', key: 'title', label: 'Pergunta' },
              { kind: 'text', key: 'text', label: 'Resposta', long: true },
            ],
            empty: { title: '', text: '' },
          },
        ],
      },
    ],
  },
  {
    id: 'links',
    title: 'Links e contato',
    description: 'Pagamento, WhatsApp e Instagram.',
    icon: Link2,
    groups: [
      {
        title: 'Compra',
        fields: [
          { kind: 'text', key: 'buyButton', label: 'Texto dos botões de compra' },
          { kind: 'text', key: 'checkoutUrl', label: 'Link de pagamento (Hotmart)', placeholder: 'https://pay.hotmart.com/…' },
        ],
      },
      {
        title: 'WhatsApp',
        description: 'O botão verde no canto da tela.',
        fields: [
          { kind: 'text', key: 'whatsapp', label: 'Número', hint: 'Com DDD.', placeholder: '(31) 97142-0128' },
          { kind: 'text', key: 'whatsappMessage', label: 'Mensagem que já vem escrita', long: true },
        ],
      },
      {
        title: 'Instagram',
        fields: [
          { kind: 'text', key: 'instagramHandle', label: '@ do Instagram', placeholder: '@keninha_pinta' },
          { kind: 'text', key: 'instagramUrl', label: 'Link do perfil', placeholder: 'https://www.instagram.com/…' },
        ],
      },
    ],
  },
]
