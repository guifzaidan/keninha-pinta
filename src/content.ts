/**
 * Todo o conteúdo editável do site fica aqui.
 * Troque o CHECKOUT_URL pelo link real de compra (Hotmart, Kiwify, etc.).
 * Todos os botões de compra do site usam esse mesmo link.
 */
import borboletaArcoIris from './assets/img/borboleta-arco-iris.webp'
import borboletaAzul from './assets/img/borboleta-azul.webp'
import borboletaBranca from './assets/img/borboleta-branca.webp'
import borboletaLilas from './assets/img/borboleta-lilas.webp'
import borboletaNoturna from './assets/img/borboleta-noturna.webp'
import onca from './assets/img/onca.webp'
import unicornio from './assets/img/unicornio.webp'

// Página de pagamento da Hotmart (produto 8558134)
export const CHECKOUT_URL = 'https://pay.hotmart.com/D107686976N'

export const INSTAGRAM = {
  handle: '@keninha_pinta',
  url: 'https://www.instagram.com/keninha_pinta/',
}

// WhatsApp: (31) 7142-0128 → formato internacional, só dígitos (55 + DDD + número)
export const WHATSAPP = {
  number: '553171420128',
  message: 'Olá! Tenho uma dúvida sobre o curso Descomplica Borboleta.',
}
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.message)}`

export const COURSE = {
  name: 'Descomplica Borboleta',
  price: '99,90',
  priceNote: 'Acesso ao curso completo',
}

export const PHOTOS = {
  hero: borboletaAzul,
  about: unicornio,
}

/**
 * Each painting gets a sticker on the photo in its main paint color.
 * `color` = sticker background (a gradient works too), `dark` = use dark text
 * when the color is too light for white text.
 */
export const GALLERY: { src: string; title: string; color: string; dark?: boolean }[] = [
  { src: borboletaAzul, title: 'Borboleta azul', color: '#2f7bd0' },
  { src: unicornio, title: 'Unicórnio alado', color: '#8f4fd9' },
  { src: onca, title: 'Máscara de onça', color: '#f6b83c', dark: true },
  {
    src: borboletaArcoIris,
    title: 'Borboleta arco-íris',
    color: 'linear-gradient(100deg, #f58ab8, #f8c95c, #8fe0c6, #82b9f2, #b597f4)',
    dark: true,
  },
  { src: borboletaNoturna, title: 'Borboleta noturna', color: '#3b2f45' },
  { src: borboletaLilas, title: 'Arabesco lilás', color: '#7a45d8' },
  { src: borboletaBranca, title: 'Borboleta delicada', color: '#d65592' },
]

export const HIGHLIGHTS = ['Do zero, sem saber desenhar', 'No seu ritmo', 'Acesso completo por R$ 99,90']

export const JOURNEY = [
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
]

export const FOR_WHO = [
  { title: 'Nunca pintou antes', text: 'As aulas começam do absoluto zero, com calma e passo a passo.' },
  { title: 'Acha que não sabe desenhar', text: 'Pintura facial é feita de movimentos simples que se aprendem com prática.' },
  { title: 'Quer pintar as crianças', text: 'Filhos, sobrinhos, alunos: deixe qualquer festa mais especial.' },
  { title: 'Sonha em trabalhar com isso', text: 'Construa a base técnica e o catálogo para os seus primeiros eventos.' },
]

export const TESTIMONIALS = [
  'O maior motivo de querer fazer o curso foi a professora: animada, humilde, alegre, criativa e espontânea. Ela ensina de um jeito que o meu cérebro com TDAH consegue compreender.',
  'Só de fazer junto com você já senti que entendi muita coisa, principalmente o contorno, que é minha maior dificuldade. Já estou ansiosa para testar nas crianças!',
  'Muito bom o curso! A prof é muito querida e engraçada, isso deixa a gente à vontade.',
]

export const OFFER_ITEMS = [
  'Aulas passo a passo, do zero ao intermediário',
  'Quais materiais comprar (e quais evitar)',
  'Traços, arabescos e contornos',
  'Técnicas de One Stroke e stencil',
  'Composições completas para o seu catálogo',
  'Assista no seu ritmo, quantas vezes quiser',
]

export const FAQ = [
  {
    q: 'Nunca pintei antes. O curso é para mim?',
    a: 'É sim! O Descomplica Borboleta foi pensado para quem está começando do zero. As técnicas aparecem de forma simples e progressiva, para você acompanhar cada etapa com tranquilidade.',
  },
  {
    q: 'Preciso saber desenhar?',
    a: 'Não. Pintura facial é feita de movimentos que se aprendem com prática: gotas, traços e espirais. Você desenvolve a mão aos poucos, aula após aula.',
  },
  {
    q: 'Preciso comprar muitos materiais?',
    a: 'Não. Dá para começar com o básico e acessível. No curso você entende quais pincéis, tintas e esponjas fazem sentido para cada pintura, sem precisar investir em tudo de uma vez.',
  },
  {
    q: 'E se eu tiver dificuldade em alguma aula?',
    a: 'Tudo bem! Você pode pausar, voltar e repetir quantas vezes precisar, no seu tempo, sem pressão para acompanhar ninguém.',
  },
  {
    q: 'Posso fazer no meu próprio ritmo?',
    a: 'Pode. Você não precisa correr para terminar: a ideia é assistir, praticar e repetir até você se sentir confiante.',
  },
  {
    q: 'Como eu acesso o curso?',
    a: 'Clique em “Quero fazer o curso” e conclua o pagamento na Hotmart. Depois da compra, a Hotmart envia por e-mail as instruções para você acessar as aulas.',
  },
]
