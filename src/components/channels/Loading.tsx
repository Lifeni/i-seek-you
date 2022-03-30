import { createSignal } from 'solid-js'
import { Modal } from '../base/Modal'

export const Loading = () => {
  const [open, setOpen] = createSignal(false)
  const handleClose = () => {}

  return <Modal size="sm" isOpen={open()} onClose={handleClose}></Modal>
}
