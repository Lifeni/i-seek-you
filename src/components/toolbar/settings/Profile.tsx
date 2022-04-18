import { useNavigate } from 'solid-app-router'
import { RiUserAccountCircleFill } from 'solid-icons/ri'
import { useSettings } from '../../../context/Settings'
import { Field, Input } from '../../base/Form'
import { Subtle } from '../../base/Text'
import { Emoji } from './Emoji'

export const Profile = () => {
  const navigate = useNavigate()
  const [settings, { setName }] = useSettings()

  return (
    <Field name="Your Profile" icon={RiUserAccountCircleFill}>
      <div w="full" flex="~" items="center" gap="6">
        <Emoji />

        <label flex="~ col 1" gap="1">
          <span flex="~" items="baseline">
            <span flex="1">Your Name</span>
            <Subtle>{settings.name.length}/18</Subtle>
          </span>
          <Input
            type="text"
            name="device-name"
            maxLength="18"
            placeholder="You"
            value={settings.name}
            onInput={e => setName((e.target as HTMLInputElement).value)}
            onEnter={() => navigate('/')}
          />
        </label>
      </div>
    </Field>
  )
}
