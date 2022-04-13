import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import colors from 'windicss/colors'
import { useSettings } from '../../context/Settings'
import { useConnection } from '../../context/Connection'

export const You = () => {
  const [copied, setCopied] = createSignal(false)
  const [animate, setAnimate] = createSignal(false)
  const [settings] = useSettings()
  const [connection] = useConnection()

  const handleCopyID = () => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/channels/${connection.id}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleAnimate = () => {
    setAnimate(true)
    setTimeout(() => setAnimate(false), 1000)
  }

  const statusText = () =>
    connection.status === 'closed'
      ? '🚫 Connection Closed'
      : connection.status === 'connected'
      ? 'Connected'
      : connection.status === 'error'
      ? '❌ Connection Error'
      : 'Connecting...'

  return (
    <div flex="~ col" items="center" justify="center" p="b-3" gap="8">
      <div
        pos="relative"
        w="16"
        h="16"
        flex="~"
        justify="center"
        items="center"
      >
        <Ripple />
        <button
          pos="relative"
          z="1"
          text="4.5rem"
          select="none"
          animate={animate() ? 'rubberBand duration-0.75s' : ''}
          onClick={handleAnimate}
        >
          {settings.emoji}
        </button>
      </div>
      <Show
        when={connection.status === 'connected'}
        fallback={
          <span
            pos="relative"
            text="lg inherit"
            font="bold"
            leading="none"
            select="none"
            z="1"
          >
            {statusText()}
          </span>
        }
      >
        <button
          pos="relative"
          text="lg inherit"
          bg="inherit"
          font="sans bold"
          leading="none"
          select="none"
          z="1"
          onClick={handleCopyID}
        >
          <span
            role="tooltip"
            aria-label={copied() ? '✅ Copied' : `Copy Your Link`}
            data-position="top"
          >
            {settings.name} #{connection.id}
          </span>
        </button>
      </Show>
    </div>
  )
}

const Ripple = () => {
  const [ripple, setRipple] = createSignal<HTMLCanvasElement>()

  onMount(() => {
    const el = ripple()
    if (!el) return

    const ctx = el.getContext('2d')
    let w: number, h: number, x: number, y: number, r: number
    let d = 0

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const check = () =>
      media.matches ? colors.dark['400'] : colors.light['600']
    let color = check()
    media.addEventListener('change', () => (color = check()))

    const init = () => {
      w = window.innerWidth
      h = window.innerHeight
      el.width = w
      el.height = h
      x = w / 2
      y = h - 128
      r = Math.min(w, h)
      draw()
    }

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 6

      for (let i = 0; i < 1; i += 0.2) {
        const t = i + d
        ctx.beginPath()
        ctx.strokeStyle = `${color}${Math.round((1 - t) * 255).toString(16)}`
        ctx.arc(x, y, r * t, 0, Math.PI * 2)
        ctx.stroke()
      }
      d += 0.002
      if (d > 0.2) d -= 0.2
    }

    const animate = () => {
      draw()
      window.requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', init)
    onCleanup(() => window.removeEventListener('resize', init))
  })

  return (
    <canvas
      ref={setRipple}
      aria-label="hidden"
      pos="fixed"
      left="0"
      top="0"
      w="100vw"
      h="100vh"
      pointer="none"
      z="0"
    />
  )
}
