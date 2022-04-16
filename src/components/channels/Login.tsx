import { useNavigate } from 'solid-app-router'
import {
  RiSystemErrorWarningFill,
  RiSystemInformationFill,
} from 'solid-icons/ri'
import { createSignal, Match, Show, Switch } from 'solid-js'
import { useBuffer } from '../../context/Buffer'
import { useChannel } from '../../context/Channel'
import { useConnection } from '../../context/Connection'
import { Dialog } from '../base/Dialog'

export const Login = () => {
  const navigate = useNavigate()
  const [channel, { setSignal, resetChannel }] = useChannel()
  const [connection] = useConnection()
  const [, { resetBuffer }] = useBuffer()
  const [password, setPassword] = createSignal('')

  const isOpen = () => !['idle', 'connected'].includes(channel.signal)
  const isAuth = () => channel.signal === 'auth'
  const isError = () => channel.signal === 'error'

  const handleAuth = () => {
    const id = channel.id
    connection.signaling?.send('call', { id, password: password() })
    setSignal('loading')
  }

  const handleCancel = () => {
    if (!isError() && !isAuth()) {
      const id = channel.id
      if (id) connection.signaling?.send('disconnect', { id })
    }
    navigate('/')
    resetChannel()
    resetBuffer()
  }

  return (
    <Dialog
      confirmText="Connect"
      cancelText={isError() ? 'Close' : 'Cancel'}
      isOpen={isOpen()}
      onConfirm={isAuth() ? handleAuth : undefined}
      onCancel={handleCancel}
    >
      <div p="x-3 y-6" flex="~ col" items="center" justify="center">
        <Show when={channel.peer?.id}>
          <span pos="relative" m="y-8" z="1" text="4.5rem" select="none">
            {channel.peer?.emoji}
          </span>
          <span
            pos="relative"
            text="lg inherit center"
            font="bold"
            leading="none"
            select="none"
            z="1"
          >
            {channel.peer?.name} #{channel.peer?.id}
          </span>
        </Show>

        <Switch
          fallback={
            <div p="y-2" flex="~" items="center" justify="center" gap="2">
              <span
                aria-label="Loading"
                w="4"
                h="4"
                border="3 light-800 dark:dark-200 !t-rose-500 rounded-full"
                animate="spin"
              />

              <span text="sm" font="bold">
                {channel.info || 'Connecting...'}
              </span>
            </div>
          }
        >
          <Match when={isAuth()}>
            <div p="y-2" flex="~ col" items="center" justify="center" gap="2">
              <div flex="~" items="center" justify="center" gap="2">
                <RiSystemInformationFill
                  w="4.5"
                  h="4.5"
                  text="blue-500 dark:blue-400"
                />
                <span text="sm" font="bold">
                  Password Required
                </span>
              </div>
              <input
                id="auth-password"
                type="text"
                name="auth-password"
                maxLength="18"
                placeholder="Enter Password"
                flex="~ 1"
                w="full"
                m="t-4 -b-4"
                p="x-3 y-2"
                border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
                font="mono"
                text="inherit center"
                bg="light-600 dark:dark-400"
                ring="focus:4 rose-500"
                transition="border"
                cursor="disabled:not-allowed"
                outline="none"
                onInput={e => setPassword((e.target as HTMLInputElement).value)}
              />
            </div>
          </Match>

          <Match when={isError()}>
            <div
              p="y-2"
              flex="~"
              items="center"
              justify="center"
              gap="2"
              text="red-500 dark:red-400"
            >
              <RiSystemErrorWarningFill w="4.5" h="4.5" />
              <span text="sm" font="bold">
                {channel.error}
              </span>
            </div>
          </Match>
        </Switch>
      </div>
    </Dialog>
  )
}
