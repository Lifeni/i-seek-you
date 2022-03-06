import { createSignal, Show } from 'solid-js'
import { Others } from './dashboard/Others'
import { Placeholder } from './dashboard/Placeholder'
import { You } from './dashboard/You'

export const Dashboard = () => {
  const [peers, setPeers] = createSignal([])
  const hasPeers = peers.length > 0

  return (
    <main flex="end col 1" p="8">
      <Show when={hasPeers} fallback={<Placeholder />}>
        <Others />
      </Show>
      <You />
    </main>
  )
}
