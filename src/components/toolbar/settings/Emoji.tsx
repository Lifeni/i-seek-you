import { useNavigate } from 'solid-app-router'
import { createResource, createSignal, For, Show, type JSX } from 'solid-js'
import { useSettings } from '../../../context/Settings'
import { Popover, Tooltip } from '../../base/Popover'

type Emojis = {
  name: string
  icon: string
  list: {
    emoji: string
    description: string
  }[]
}[]

export const Emoji = () => {
  const [settings, { setEmoji }] = useSettings()
  const navigate = useNavigate()
  const [container, setContainer] = createSignal<HTMLElement>()
  const [isOpen, setOpen] = createSignal(false)

  const handleScroll = (e: MouseEvent) => {
    const icon = (e.target as HTMLDivElement).dataset.id
    const target = container()
    if (!icon || !target) return
    target.querySelector(`#${icon}`)?.scrollIntoView()
  }

  const handleClick = (e: MouseEvent) => {
    setEmoji((e.target as HTMLButtonElement).textContent || '')
    setOpen(false)
    navigate('/settings')
  }

  const fetcher = async () => await (await fetch('/emojis.json')).json()
  const [emojis] = createResource<Emojis>(fetcher)

  return (
    <>
      <Tooltip name="Select Your Emoji">
        <button
          pos="relative"
          font="emoji"
          w="4.5rem"
          flex="~"
          items="center"
          justify="center"
          leading="none"
          text="4.5rem"
          onClick={() => setOpen(true)}
        >
          {settings.emoji}
        </button>
      </Tooltip>

      <Popover pos="fixed" isOpen={isOpen()} onClose={() => setOpen(false)}>
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
          <Show when={!emojis.loading}>
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
                  <Cell
                    name={list.name}
                    data-id={list.name.toLowerCase().replace(/\s+&?\s?/g, '-')}
                    onClick={handleScroll}
                  >
                    {list.icon}
                  </Cell>
                )}
              </For>
            </nav>
            <div ref={setContainer} p="x-2 b-2">
              <For each={emojis()}>
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
                          <Cell
                            role="listitem"
                            name={item.description}
                            onClick={handleClick}
                          >
                            {item.emoji}
                          </Cell>
                        )}
                      </For>
                    </div>
                  </section>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Popover>
    </>
  )
}

interface CellProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  onClick: (e: MouseEvent) => void
}

const Cell = (props: CellProps) => (
  <button
    aria-label={props.name}
    title={props.name}
    w="10"
    h="10"
    p="b-0.5"
    bg="hover:(light-600 dark:dark-400)"
    rounded="sm"
    font="emoji"
    text="2xl"
    {...props}
  >
    {props.children}
  </button>
)
