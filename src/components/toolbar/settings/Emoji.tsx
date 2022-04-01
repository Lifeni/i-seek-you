import { useNavigate } from 'solid-app-router'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from 'solid-headless'
import { createResource, createSignal, For, Show } from 'solid-js'
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

export const Emoji = () => {
  const [config, { setEmoji }] = useConfig()
  const navigate = useNavigate()
  const [panel, setPanel] = createSignal<HTMLElement>()

  const handleScroll = (e: MouseEvent) => {
    const icon = (e.target as HTMLDivElement).dataset.id
    const el = panel()
    if (icon && el) el.querySelector(`#${icon}`)?.scrollIntoView()
  }

  const handleClick = (e: MouseEvent) => {
    setEmoji((e.target as HTMLButtonElement).textContent || '')
    navigate('/settings')
  }

  const fetcher = async () => await (await fetch('/emojis.json')).json()
  const [emojis] = createResource<Emojis>(fetcher)

  return (
    <Popover pos="relative" onClose={() => navigate('/settings')}>
      {({ isOpen }) => (
        <>
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
                  flex="~ col"
                  style={{
                    'scroll-behavior': 'smooth',
                    'scroll-padding': '3rem 0 0 0',
                    'scroll-width': 'thin',
                  }}
                >
                  <Show
                    when={!emojis.loading}
                    fallback={
                      <div
                        flex="~ 1"
                        justify="center"
                        items="center"
                        text="sm gray-500 dark:gray-400"
                      >
                        Loading...
                      </div>
                    }
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
                      <For each={emojis()}>
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
                    <article ref={setPanel} p="x-2 b-2">
                      <For each={emojis()}>
                        {list => (
                          <section>
                            <h2
                              id={list.name
                                .toLowerCase()
                                .replace(/\s+&?\s?/g, '-')}
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
                  </Show>
                </div>
              </PopoverPanel>
            </Transition>
          </Portal>
        </>
      )}
    </Popover>
  )
}
