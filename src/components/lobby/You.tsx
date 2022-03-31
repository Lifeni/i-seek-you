import { Link } from 'solid-app-router'
import { createSignal, onCleanup, onMount } from 'solid-js'
import colors from 'windicss/colors'
import { useConfig } from '../../context/Config'
import { useConnection } from '../../context/Connection'

export const You = () => {
  const [copied, setCopied] = createSignal(false)
  const [config] = useConfig()
  const [session] = useConnection()

  const handleCopyID = () => {
    navigator.clipboard.writeText(
      `https://${window.location.host}/channels/${session.id}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

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
        <Link
          role="tooltip"
          aria-label="Change Your Emoji"
          data-position="top"
          href="/settings#emoji"
          z="1"
          text="4.5rem"
          select="none"
        >
          {config.emoji}
        </Link>
      </div>

      <button
        role="tooltip"
        aria-label={copied() ? '✅ Copied' : `Copy Your Link`}
        data-position="top"
        text="lg inherit"
        bg="inherit"
        font="sans bold"
        leading="none"
        select="none"
        z="1"
        onClick={handleCopyID}
      >
        {config.name} #{session.id}
      </button>
    </div>
  )
}

const Ripple = () => {
  let ripple: HTMLCanvasElement

  onMount(() => {
    if (!ripple) return

    const ctx = ripple.getContext('2d')
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
      ripple.width = w
      ripple.height = h
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
    onCleanup(() => {
      window.removeEventListener('resize', init)
    })
  })

  return (
    <canvas
      ref={el => (ripple = el)}
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
