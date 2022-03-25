import { Route, Router, Routes } from 'solid-app-router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'
import { ConfigProvider } from './context/Config'
import { SessionProvider } from './context/Session'
import './libs/tooltip.css'

const Home = lazy(() => import('./pages/index'))
const NotFound = lazy(() => import('./pages/[...all]'))

const App = () => {
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
          <Route path="/" element={<Home />}>
            <Route path="/+" />
            <Route path="/auth/:id" />
            <Route path="/channels/:id" />
            <Route path="/server" />
            <Route path="/settings" />
            <Route path="/share" />
            <Route path="/" />
          </Route>
          <Route path="/*all" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  )
}

render(
  () => (
    <SessionProvider>
      <ConfigProvider>
        <MetaProvider>
          <App />
        </MetaProvider>
      </ConfigProvider>
    </SessionProvider>
  ),
  document.getElementById('root') as HTMLElement
)
