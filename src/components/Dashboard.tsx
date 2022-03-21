import { Others } from './dashboard/Others'
import { You } from './dashboard/You'

export const Dashboard = () => {
  return (
    <main flex="~ col 1" p="8">
      <Others />
      <You />
    </main>
  )
}
