import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { loadContent } from './content-store'
import { ContentProvider } from './site-content'

const root = createRoot(document.getElementById('root')!)
const isAdmin = /^\/admin\/?$/.test(window.location.pathname)

if (isAdmin) {
  // The editor is its own chunk: visitors of the site never download it
  const Admin = lazy(() => import('./admin/Admin'))
  root.render(
    <StrictMode>
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    </StrictMode>,
  )
} else {
  // Wait for the content saved in /admin (or the defaults) so old texts never flash on screen
  loadContent().then((content) =>
    root.render(
      <StrictMode>
        <ContentProvider value={content}>
          <App />
        </ContentProvider>
      </StrictMode>,
    ),
  )
}
