import { gemoji } from 'gemoji'
import { useLocation, useNavigate } from 'solid-app-router'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from 'solid-headless'
import { For } from 'solid-js'
import { Portal } from 'solid-js/web'
import { useConfig } from '../../../context/Config'

type Emojis = {
  name: string
  icon: string
  list: {
    emoji: string
    description: string
  }[]
}[]

const EmojiList = [
  { name: 'Smileys & Emotion', icon: '🙂' },
  { name: 'People & Body', icon: '👋' },
  { name: 'Animals & Nature', icon: '🐶' },
  { name: 'Food & Drink', icon: '🍉' },
  { name: 'Travel & Places', icon: '🏖️' },
  { name: 'Activities', icon: '🎉' },
  { name: 'Objects', icon: '📖' },
  { name: 'Symbols', icon: '#️⃣' },
  { name: 'Flags', icon: '🚩' },
  { name: 'GitHub Custom Emoji', icon: '📎' },
]

const emojis = gemoji.reduce((emojis, emoji) => {
  const name = emoji.category
  const list = emojis.find(i => i.name === name)
  const item = { emoji: emoji.emoji, description: emoji.description }
  const icon = EmojiList.find(i => i.name === name)?.icon ?? ''
  if (list) list.list.push(item)
  else emojis.push({ name, icon, list: [item] })
  return emojis
}, [] as Emojis)

export const Emoji = () => {
  const [config, { setEmoji }] = useConfig()
  const location = useLocation()
  const navigate = useNavigate()
  const isOpen = () =>
    location.pathname === '/settings' && location.hash === 'emoji'

  let panel: HTMLElement

  const handleScroll = (e: MouseEvent) => {
    const icon = (e.target as HTMLDivElement).dataset.id
    if (icon && panel) panel.querySelector(`#${icon}`)?.scrollIntoView()
  }

  const handleClick = (e: MouseEvent) => {
    setEmoji((e.target as HTMLButtonElement).textContent || '')
    navigate('/settings')
  }

  return (
    <Popover pos="relative" onClose={() => navigate('/settings')}>
      <PopoverButton
        role="tooltip"
        aria-label="Select Your Emoji"
        data-position="top"
        pos="relative"
        font="emoji"
        w="4.5rem"
        flex="~"
        items="center"
        justify="center"
        rounded="full"
        leading="none"
        text="4.5rem"
        before="font-sans"
        onClick={() => navigate('/settings#emoji')}
      >
        <div>{config.emoji}</div>
      </PopoverButton>

      <Portal>
        <Transition
          show={isOpen()}
          enter="transition duration-200"
          enterFrom="opacity-0 scale-96"
          enterTo="opacity-100 scale-100"
          leave="transition duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-96"
          pos="relative"
          rounded="md"
          overflow="hidden"
          z="2000"
        >
          <PopoverPanel
            unmount={false}
            pos="fixed"
            bottom="0 sm:5vh"
            left="0 sm:1/2"
            z="2000"
            rounded="t-md sm:md"
            bg="light-100 dark:dark-800"
            shadow="2xl"
            transform="sm:~ sm:-translate-x-1/2"
            overflow="hidden"
          >
            <div
              w="screen"
              max-w="unset sm:100"
              h="40vh"
              overflow="y-auto x-hidden"
              style={{
                'scroll-behavior': 'smooth',
                'scroll-padding': '3rem 0 0 0',
                'scroll-width': 'thin',
              }}
            >
              <nav
                w="full"
                grid="~ cols-9"
                pos="sticky"
                top="0"
                p="2"
                bg="light-100/80 dark:dark-800/80"
                backdrop="~ blur-sm"
              >
                <For each={emojis}>
                  {list => (
                    <button
                      aria-label={list.name}
                      title={list.name}
                      data-id={list.name
                        .toLowerCase()
                        .replace(/\s+&?\s?/g, '-')}
                      w="10"
                      h="10"
                      p="b-0.5"
                      bg="hover:(light-600 dark:dark-400)"
                      rounded="sm"
                      font="emoji"
                      text="2xl gray-800 dark:gray-300"
                      leading="none"
                      onClick={handleScroll}
                    >
                      {list.icon}
                    </button>
                  )}
                </For>
              </nav>
              <article ref={el => (panel = el)} class="px-2 pb-2">
                <For each={emojis}>
                  {list => (
                    <section>
                      <h2
                        id={list.name.toLowerCase().replace(/\s+&?\s?/g, '-')}
                        w="full"
                        p="2"
                        text="sm gray-500 dark:gray-400"
                        font="bold"
                      >
                        {list.name}
                      </h2>
                      <div role="list" grid="~ cols-9">
                        <For each={list.list}>
                          {item => (
                            <button
                              role="listitem"
                              aria-label={item.description}
                              title={item.description}
                              w="10"
                              h="10"
                              p="b-0.5"
                              bg="hover:(light-600 dark:dark-400)"
                              rounded="sm"
                              font="emoji"
                              text="2xl"
                              onClick={handleClick}
                            >
                              {item.emoji}
                            </button>
                          )}
                        </For>
                      </div>
                    </section>
                  )}
                </For>
              </article>
            </div>
          </PopoverPanel>
        </Transition>
      </Portal>
    </Popover>
  )
}
