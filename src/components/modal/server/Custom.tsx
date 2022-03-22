import { RiDeviceSignalWifiFill } from 'solid-icons/ri'
import { createSignal } from 'solid-js'

export const Custom = () => {
  const [custom, setCustom] = createSignal('')

  return (
    <fieldset w="full" p="3">
      <legend
        flex="~"
        items="center"
        text="sm gray-500 dark:gray-400"
        font="bold"
        gap="2"
      >
        <RiDeviceSignalWifiFill /> WebRTC Server
      </legend>
      <div w="full" flex="~ col" gap="2">
        <p text="sm gray-500 dark:gray-400">
          You can deploy a WebRTC server of your own via Docker.
          <a
            href="https://github.com/Lifeni/i-seek-you-server#readme"
            target="_blank"
            rel="noopener noreferrer"
            m="x-2"
            text="rose-500 hover:underline"
            font="bold"
          >
            Read docs
          </a>
        </p>

        <input
          id="webrtc-server"
          type="text"
          name="webrtc-server"
          maxLength="18"
          placeholder="https://server.i-seek-you.dist.run"
          flex="~ 1"
          m="t-1"
          p="x-3 y-2"
          border="1 transparent rounded-sm hover:rose-500 !disabled:transparent"
          text="inherit"
          bg="light-600 dark:dark-400"
          ring="focus:4 rose-500"
          transition="border"
          cursor="disabled:not-allowed"
          outline="none"
          value={custom()}
          onInput={e => setCustom((e.target as HTMLInputElement).value)}
        />
      </div>
    </fieldset>
  )
}
