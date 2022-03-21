import 'lu2/theme/edge/css/common/ui/Checkbox.css'
import 'lu2/theme/edge/css/common/ui/Switch.css'
import 'lu2/theme/edge/css/common/ui/Tips.css'
import 'lu2/theme/edge/js/common/ui/Tips.js'
import { Route, Router, Routes } from 'solid-app-router'
import { lazy, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'

const Home = lazy(() => import('./pages/index'))
const NotFound = lazy(() => import('./pages/[...all]'))

const App = () => {
  onMount(() => {
    const html = document.documentElement
    html.className = localStorage.getItem('theme') || 'dark'
  })

  return (
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
          <Route path="/" element={<Home />} />
          <Route path="/*all" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

render(
  () => (
    <MetaProvider>
      <App />
    </MetaProvider>
  ),
  document.getElementById('root') as HTMLElement
)
