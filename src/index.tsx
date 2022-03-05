import { Route, Router, Routes } from 'solid-app-router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'uno.css'

const Home = lazy(() => import('./pages/index'))
const NotFound = lazy(() => import('./pages/[...all]'))

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/*all" element={<NotFound />} />
  </Routes>
)

render(
  () => (
    <MetaProvider>
      <Router>
        <App />
      </Router>
    </MetaProvider>
  ),
  document.getElementById('root') as HTMLElement
)
