import { About } from './components/About'
import { FloatingActions } from './components/Extras'
import { Faq } from './components/Faq'
import { Footer } from './components/Footer'
import { ForWho } from './components/ForWho'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Journey } from './components/Journey'
import { Offer } from './components/Offer'
import { useRevealOnScroll } from './hooks'

/*
 * Page flow: what is it → see the results → what you learn → is it for me
 * → who teaches → price & buy → doubts.
 */
export default function App() {
  useRevealOnScroll()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Journey />
        <ForWho />
        <About />
        <Offer />
        <Faq />
      </main>
      <Footer />
      <FloatingActions />
    </>
  )
}
