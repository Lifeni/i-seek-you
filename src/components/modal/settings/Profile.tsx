import { RiUserAccountCircleFill } from 'solid-icons/ri'
import { useContext } from 'solid-js'
import { ConfigContext } from '../../../context/Config'
import { Emoji } from './Emoji'

export const Profile = () => {
  const [config, { setName }] = useContext(ConfigContext)

  return (
    <fieldset w="full" p="3">
      <legend
        flex="~"
        items="center"
        text="sm gray-500 dark:gray-400"
        font="bold"
        gap="2"
      >
        <RiUserAccountCircleFill w="4" h="4" /> Your Profile
      </legend>
      <div w="full" flex="~" items="center" gap="6">
        <Emoji />

        <label flex="~ col 1" gap="2">
          <span flex="~" items="baseline">
            <span flex="1">Your Name</span>
            <span text="sm gray-500 dark:gray-400">
              {config.name.length}/18
            </span>
          </span>
          <input
            type="text"
            name="device-name"
            maxLength="18"
            placeholder="You"
            w="full"
            flex="~ 1"
            p="x-3 y-2"
            border="1 transparent rounded-sm hover:rose-500"
            text="inherit"
            bg="light-600 dark:dark-400"
            ring="focus:4 rose-500"
            transition="border"
            outline="none"
            value={config.name}
            onInput={e => setName((e.target as HTMLInputElement).value)}
          />
        </label>
      </div>
    </fieldset>
  )
}
