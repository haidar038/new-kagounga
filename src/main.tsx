import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { initI18n } from './i18n'
import { preloadPage } from './app/pages'
import { getLocaleFromPath } from './lib/seo'
import './index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
    <Analytics />
    <SpeedInsights />
  </StrictMode>
)

// Route locale is authoritative. Waiting for i18n avoids a hydration mismatch
// when localStorage holds the other language.
void (async () => {
  const pathname = window.location.pathname
  await Promise.all([initI18n(getLocaleFromPath(pathname)), preloadPage(pathname)])

  // Prerendered routes ship body HTML; hydrate it. Untouched routes (e.g. 404)
  // still mount from scratch.
  if (container.hasChildNodes()) {
    hydrateRoot(container, app)
  } else {
    createRoot(container).render(app)
  }
})()
