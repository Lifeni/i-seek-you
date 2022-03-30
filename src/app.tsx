import { Route, Router, Routes } from 'solid-app-router'
import { lazy, Suspense } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'
import { Loading } from './components/channels/Loading'
import { ConfigProvider } from './context/Config'
import { ConnectionProvider } from './context/Connection'
import './libs/tooltip.css'

const Home = lazy(() => import('./pages/Home'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
    <Suspense fallback={<Loading />}>
      <MetaProvider>
        <ConnectionProvider>
          <ConfigProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />}>
                  <Route path="/+" />
                  <Route path="/channels/:id" />
                  <Route path="/server" />
                  <Route path="/settings" />
                  <Route path="/share" />
                  <Route path="/" />
                </Route>
                <Route path="/*all" element={<NotFound />} />
              </Routes>
            </Router>
          </ConfigProvider>
        </ConnectionProvider>
      </MetaProvider>
    </Suspense>
  </div>
)

render(() => <App />, document.getElementById('root') as HTMLElement)
