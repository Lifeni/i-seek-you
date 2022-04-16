import { Route, Router, Routes } from 'solid-app-router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'
import { BufferProvider } from './context/Buffer'
import { ChannelProvider } from './context/Channel'
import { ConnectionProvider } from './context/Connection'
import { SettingsProvider } from './context/Settings'
import './libs/Tooltip.css'

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
    <MetaProvider>
      <ConnectionProvider>
        <SettingsProvider>
          <ChannelProvider>
            <BufferProvider>
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
            </BufferProvider>
          </ChannelProvider>
        </SettingsProvider>
      </ConnectionProvider>
    </MetaProvider>
  </div>
)

render(() => <App />, document.getElementById('root') as HTMLElement)
