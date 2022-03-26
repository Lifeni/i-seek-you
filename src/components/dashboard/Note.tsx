import { RiDevicePhoneFindFill } from 'solid-icons/ri'
import { createSignal, onMount } from 'solid-js'

export const Note = () => {
  const [suffix, setSuffix] = createSignal('')

  onMount(() => {
    setInterval(() => {
      suffix().length === 3 ? setSuffix('') : setSuffix(s => (s += '.'))
    }, 600)
  })

  return (
    <div min-w="20" flex="~ col" items="center" gap="2">
      <span
        role="tooltip"
        aria-label="Seeking Local Devices"
        data-position="top"
        w="18"
        h="18"
        flex="~"
        justify="center"
        items="center"
        text="light-100 dark:light-600"
        bg="rose-500"
        rounded="full"
      >
        <RiDevicePhoneFindFill class="w-8 h-8" text="inherit" />
      </span>

      <span pos="relative" font="bold" select="none">
        Seeking
        <span pos="absolute" left="full">
          {suffix()}
        </span>
      </span>
    </div>
  )
}
