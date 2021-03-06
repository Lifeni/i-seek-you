import { Route, Router, Routes } from 'solid-app-router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { MetaProvider } from 'solid-meta'
import 'windi.css'
import { Reload } from './components/Reload'
import { ConnectionProvider } from './context/Connection'
import { I18nProvider } from './context/i18n/I18n'
import { ServerProvider } from './context/Server'
import { SettingsProvider } from './context/Settings'
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
    <I18nProvider>
      <MetaProvider>
        <ServerProvider>
          <SettingsProvider>
            <ConnectionProvider>
              <Reload />
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
            </ConnectionProvider>
          </SettingsProvider>
        </ServerProvider>
      </MetaProvider>
    </I18nProvider>
  </div>
)

render(() => <App />, document.getElementById('root') as HTMLElement)
