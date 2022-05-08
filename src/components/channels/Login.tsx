import { useI18n } from '@solid-primitives/i18n'
import { useNavigate } from 'solid-app-router'
import {
  RiSystemErrorWarningFill,
  RiSystemInformationFill,
} from 'solid-icons/ri'
import { batch, createSignal, Match, Show, Switch, type JSX } from 'solid-js'
import { useConnection } from '../../context/Connection'
import { useServer } from '../../context/Server'
import { Input } from '../base/Form'
import { Modal } from '../base/Modal'

export const Login = () => {
  const [t] = useI18n()
  const navigate = useNavigate()
  const [server] = useServer()
  const [connection, { setSignal, resetConnection, setInfo }] = useConnection()
  const [password, setPassword] = createSignal('')

  const isOpen = () => !['idle', 'connected'].includes(connection.signal)
  const isError = () => connection.signal === 'error'
  const isAuth = () => connection.signal === 'auth'

  const handleAuth = async () => {
    batch(() => {
      setSignal('loading')
      setInfo('Calling')
    })

    const key = `${server.id}->${connection.id}:${password()}`

    const handleMessage = (event: MessageEvent) => {
      const { type, hash, pk } = event.data
      if (type !== 'call') return
      console.debug('[sm2]', 'new keypair')
      server.websocket?.send('call', { id: connection.id, password: hash, pk })
      worker?.removeEventListener('message', handleMessage)
    }

    const worker = server.worker
    worker?.addEventListener('message', handleMessage)
    worker?.postMessage({ action: 'call', text: key })
  }

  const handleCancel = () => {
    const id = connection.id
    navigate('/', { replace: true })
    if (!id) return
    if (!isAuth() && !isError()) server.websocket?.send('disconnect', { id })
    resetConnection()
  }

  return (
    <Modal
      name="Login"
      size="xs"
      isOpen={isOpen()}
      hasActionBar
      actionText={[isError() ? t('close') : t('cancel'), t('connect')]}
      isBlur={isAuth()}
      onConfirm={isAuth() ? handleAuth : undefined}
      onCancel={handleCancel}
    >
      <div p="6" flex="~ col" items="center" justify="center">
        <Show when={connection.peer?.id}>
          <span
            pos="relative"
            m="t-6 b-8"
            z="1"
            text="4.5rem"
            font="emoji"
            select="none"
          >
            {connection.peer?.emoji}
          </span>
          <span
            pos="relative"
            text="lg inherit center"
            font="bold"
            leading="none"
            select="none"
            z="1"
          >
            {connection.peer?.name} #{connection.peer?.id}
          </span>
        </Show>

        <div
          w="full"
          p="t-2"
          flex="~ col"
          items="center"
          justify="center"
          gap="2"
        >
          <Switch fallback={<Label type="loading">{connection.info}</Label>}>
            <Match when={isAuth()}>
              <Input
                type="text"
                name="auth-password"
                placeholder={t('login_placeholder')}
                isFocus
                text="center"
                w="full"
                m="t-2"
                onInput={e => setPassword((e.target as HTMLInputElement).value)}
              />
              <Label type="info">{t('login_description')}</Label>
            </Match>
            <Match when={isError()}>
              <Label type="error">{connection.error}</Label>
            </Match>
          </Switch>
        </div>
      </div>
    </Modal>
  )
}

interface LabelProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  type: 'info' | 'error' | 'loading'
}

const Label = (props: LabelProps) => (
  <div
    p="y-1"
    flex="~"
    items="center"
    justify="center"
    gap="2"
    text={
      props.type === 'error'
        ? 'red-500 dark:red-400'
        : props.type === 'info'
        ? 'blue-500 dark:blue-400'
        : 'inherit'
    }
  >
    <Switch
      fallback={
        <span
          aria-label="Loading"
          w="4"
          h="4"
          border="3 light-800 dark:dark-200 !t-rose-500 rounded-full"
          animate="spin"
        />
      }
    >
      <Match when={props.type === 'error'}>
        <RiSystemErrorWarningFill w="4.5" h="4.5" />
      </Match>
      <Match when={props.type === 'info'}>
        <RiSystemInformationFill w="4.5" h="4.5" />
      </Match>
    </Switch>
    <span text="sm" font="bold">
      {props.children}
    </span>
  </div>
)
