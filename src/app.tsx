import '@shoelace-style/shoelace/dist/components/qr-code/qr-code.js'
import '@shoelace-style/shoelace/dist/components/switch/switch.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'
import { setDefaultAnimation } from '@shoelace-style/shoelace/dist/utilities/animation-registry.js'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path'
import { Route, Router, Routes } from 'solid-app-router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'
import './libs/shoelace.css'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace/dist/')

setDefaultAnimation('tooltip.show', {
  keyframes: [
    { opacity: 0, transform: 'scale(0.95)' },
    { opacity: 1, transform: 'scale(1)' },
  ],
  options: { duration: 200, easing: 'cubic-bezier(.22,1,.2,1)' },
})

setDefaultAnimation('tooltip.hide', {
  keyframes: [
    { opacity: 1, transform: 'scale(1)' },
    { opacity: 0, transform: 'scale(0.95)' },
  ],
  options: { duration: 200, easing: 'cubic-bezier(.22,1,.2,1)' },
})

const Home = lazy(() => import('./pages/index'))
const NotFound = lazy(() => import('./pages/[...all]'))

const App = () => (
  <div
    h="screen"
    flex="~ col"
    justify="center"
    items="center"
    bg="light-100 dark:dark-800"
    font="sans"
    text="gray-800 dark:gray-300"
    overflow="hidden"
  >
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" />
          <Route path="/about" />
          <Route path="/messages" />
          <Route path="/server" />
          <Route path="/settings" />
        </Route>
        <Route path="/*all" element={<NotFound />} />
      </Routes>
    </Router>
  </div>
)

render(
  () => (
    <MetaProvider>
      <App />
    </MetaProvider>
  ),
  document.getElementById('root') as HTMLElement
)
