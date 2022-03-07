import { type JSX } from 'solid-js'
import { Field, Form } from '../base/Form'
import { Modal } from './Modal'

interface ProfileProps extends JSX.HTMLAttributes<HTMLDivElement> {
  close: () => void
}

export const Profile = (props: ProfileProps) => (
  <Modal title="Your Profile" close={props.close}>
    <Form>
      <Field legend="Avatar">Todo: Set Your Emoji Avatar.</Field>
      <Field legend="Password">Todo: Set Your Connection Password.</Field>
    </Form>
  </Modal>
)

export default Profile
