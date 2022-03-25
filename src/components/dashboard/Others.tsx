import { Join } from '../modal/Join'
import { Share } from '../modal/Share'
import { Note } from './Note'

export const Others = () => {
  return (
    <div flex="~ 1" items="center" justify="center" z="10" gap="8">
      <Share />
      <Note />
      <Join />
    </div>
  )
}
