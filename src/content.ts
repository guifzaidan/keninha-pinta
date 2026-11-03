/**
 * Conteúdo padrão do site. Tudo aqui pode ser alterado pelo painel em /admin;
 * o que for salvo lá substitui estes valores. Se nada foi salvo (ou o painel
 * estiver fora do ar), o site usa exatamente o que está aqui.
 *
 * Nos títulos e parágrafos, *texto entre asteriscos* aparece destacado.
 */
import borboletaArcoIris from './assets/img/borboleta-arco-iris.webp'
import borboletaAzul from './assets/img/borboleta-azul.webp'
import borboletaBranca from './assets/img/borboleta-branca.webp'
import borboletaLilas from './assets/img/borboleta-lilas.webp'
import borboletaNoturna from './assets/img/borboleta-noturna.webp'
import onca from './assets/img/onca.webp'
import unicornio from './assets/img/unicornio.webp'

/**
 * Built-in photos. Their URLs carry a build hash, so saved content refers to them as
 * "asset:<name>" instead (see site-content.tsx).
 */
export const ASSETS: Record<string, string> = {
  'borboleta-arco-iris': borboletaArcoIris,
  'borboleta-azul': borboletaAzul,
  'borboleta-branca': borboletaBranca,
  'borboleta-lilas': borboletaLilas,
  'borboleta-noturna': borboletaNoturna,
  onca,
  unicornio,
}

export type TitledText = { title: string; text: string }
export type GalleryItem = {
  src: string
  title: string
  /** Sticker background (a CSS gradient works too) */
  color: string
  /** Dark text on the sticker, for light colors */
  dark: boolean
}

export const DEFAULT_CONTENT = {
  links: {
    // Página de pagamento da Hotmart (produto 8558134)
    checkoutUrl: 'https://pay.hotmart.com/D107686976N',
    buyButton: 'Quero fazer o curso',
    instagramHandle: '@keninha_pinta',
    instagramUrl: 'https://www.instagram.com/keninha_pinta/',
    whatsapp: '(31) 7142-0128',
    whatsappMessage: 'Olá! Tenho uma dúvida sobre o curso Descomplica Borboleta.',
  },
  course: {
    name: 'Descomplica Borboleta',
    price: '99,90',
    priceNote: 'Acesso ao curso completo',
  },
  hero: {
    eyebrow: 'Curso online de pintura facial',
    title: 'Aprenda *pintura facial* do zero, no seu ritmo',
    text: 'No *Descomplica Borboleta*, a Keninha te ensina passo a passo, dos materiais certos às primeiras pinturas completas, mesmo que você ache que não sabe desenhar.',
    secondaryLink: 'Ver o que vou aprender',
    highlights: ['Do zero, sem saber desenhar', 'No seu ritmo', 'Acesso completo por R$ 99,90'],
    image: borboletaAzul,
    imageAlt: 'Keninha com uma pintura facial de borboleta azul no rosto',
  },
  gallery: {
    eyebrow: 'Galeria',
    title: 'Do primeiro traço a pinturas como estas',
    sub: 'Algumas das pinturas que você vai aprender a fazer no curso.',
    items: [
      { src: borboletaAzul, title: 'Borboleta azul', color: '#2f7bd0', dark: false },
      { src: unicornio, title: 'Unicórnio alado', color: '#8f4fd9', dark: false },
      { src: onca, title: 'Máscara de onça', color: '#f6b83c', dark: true },
      {
        src: borboletaArcoIris,
        title: 'Borboleta arco-íris',
        color: 'linear-gradient(100deg, #f58ab8, #f8c95c, #8fe0c6, #82b9f2, #b597f4)',
        dark: true,
      },
      { src: borboletaNoturna, title: 'Borboleta noturna', color: '#3b2f45', dark: false },
      { src: borboletaLilas, title: 'Arabesco lilás', color: '#7a45d8', dark: false },
      { src: borboletaBranca, title: 'Borboleta delicada', color: '#d65592', dark: false },
    ] as GalleryItem[],
  },
  journey: {
    eyebrow: 'O curso',
    title: 'O caminho, passo a passo',
    sub: 'Cada etapa se apoia na anterior, para você nunca se sentir perdida.',
    items: [
      {
        title: 'Materiais que fazem sentido',
        text: 'Quais tintas, pincéis e esponjas realmente importam para começar, sem gastar à toa.',
      },
      {
        title: 'Traços e arabescos',
        text: 'Os movimentos que formam todo desenho bonito: gotas, espirais, folhas e contornos limpos.',
      },
      {
        title: 'One Stroke e stencil',
        text: 'Os atalhos para pinturas rápidas, coloridas e cheias de efeito.',
      },
      {
        title: 'Suas primeiras pinturas',
        text: 'Composições completas, como borboletas, bichinhos e fantasia, para montar o seu primeiro catálogo.',
      },
      {
        title: 'Base para continuar',
        text: 'Um processo claro para praticar sozinha e desenvolver o seu próprio estilo.',
      },
    ] as TitledText[],
  },
  forWho: {
    eyebrow: 'Para quem é',
    title: 'É para você que…',
    items: [
      { title: 'Nunca pintou antes', text: 'As aulas começam do absoluto zero, com calma e passo a passo.' },
      { title: 'Acha que não sabe desenhar', text: 'Pintura facial é feita de movimentos simples que se aprendem com prática.' },
      { title: 'Quer pintar as crianças', text: 'Filhos, sobrinhos, alunos: deixe qualquer festa mais especial.' },
      { title: 'Sonha em trabalhar com isso', text: 'Construa a base técnica e o catálogo para os seus primeiros eventos.' },
    ] as TitledText[],
  },
  about: {
    eyebrow: 'Quem vai te ensinar',
    title: 'Prazer, eu sou a *Keninha*',
    paragraphs: [
      'Sou a Kênia Laís e transformo rostos em borboletas, bichinhos e personagens usando pincel, tinta e muito glitter.',
      'No Descomplica Borboleta, juntei o caminho que faz sentido para quem está começando: o que comprar, o que treinar primeiro e como chegar nas primeiras pinturas completas. Tudo explicado com calma e bom humor.',
    ],
    image: unicornio,
    imageAlt: 'Kênia Laís, a Keninha, com uma pintura de unicórnio no rosto',
    instagramText: 'Acompanhe no Instagram',
  },
  offer: {
    eyebrow: 'Curso completo',
    secureNote: 'Pagamento seguro pela Hotmart',
    items: [
      'Aulas passo a passo, do zero ao intermediário',
      'Quais materiais comprar (e quais evitar)',
      'Traços, arabescos e contornos',
      'Técnicas de One Stroke e stencil',
      'Composições completas para o seu catálogo',
      'Assista no seu ritmo, quantas vezes quiser',
    ],
  },
  faq: {
    eyebrow: 'Dúvidas',
    title: 'Perguntas frequentes',
    items: [
      {
        title: 'Nunca pintei antes. O curso é para mim?',
        text: 'É sim! O Descomplica Borboleta foi pensado para quem está começando do zero. As técnicas aparecem de forma simples e progressiva, para você acompanhar cada etapa com tranquilidade.',
      },
      {
        title: 'Preciso saber desenhar?',
        text: 'Não. Pintura facial é feita de movimentos que se aprendem com prática: gotas, traços e espirais. Você desenvolve a mão aos poucos, aula após aula.',
      },
      {
        title: 'Preciso comprar muitos materiais?',
        text: 'Não. Dá para começar com o básico e acessível. No curso você entende quais pincéis, tintas e esponjas fazem sentido para cada pintura, sem precisar investir em tudo de uma vez.',
      },
      {
        title: 'E se eu tiver dificuldade em alguma aula?',
        text: 'Tudo bem! Você pode pausar, voltar e repetir quantas vezes precisar, no seu tempo, sem pressão para acompanhar ninguém.',
      },
      {
        title: 'Posso fazer no meu próprio ritmo?',
        text: 'Pode. Você não precisa correr para terminar: a ideia é assistir, praticar e repetir até você se sentir confiante.',
      },
      {
        title: 'Como eu acesso o curso?',
        text: 'Clique em “Quero fazer o curso” e conclua o pagamento na Hotmart. Depois da compra, a Hotmart envia por e-mail as instruções para você acessar as aulas.',
      },
    ] as TitledText[],
    footer: 'Ainda com dúvida? Fale comigo no Instagram',
  },
}

export type SiteContent = typeof DEFAULT_CONTENT

/** wa.me link from a Brazilian number typed any way, e.g. "(31) 7142-0128". */
export function whatsappUrl(phone: string, message: string) {
  let digits = phone.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`
}

// Seção de depoimentos fora do site por enquanto (ainda não há depoimentos reais).
export const TESTIMONIALS = [
  'O maior motivo de querer fazer o curso foi a professora: animada, humilde, alegre, criativa e espontânea. Ela ensina de um jeito que o meu cérebro com TDAH consegue compreender.',
  'Só de fazer junto com você já senti que entendi muita coisa, principalmente o contorno, que é minha maior dificuldade. Já estou ansiosa para testar nas crianças!',
  'Muito bom o curso! A prof é muito querida e engraçada, isso deixa a gente à vontade.',
]
