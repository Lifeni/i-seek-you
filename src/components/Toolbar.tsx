import { Link } from 'solid-app-router'
import { RiSystemSettingsFill } from 'solid-icons/ri'
import { Settings } from './modal/Settings'
import { Server } from './modal/Server'

export const Toolbar = () => {
  return (
    <header
      role="toolbar"
      w="full"
      flex="~"
      justify="between"
      items="center"
      p="x-6 y-6 sm:x-8"
      z="20"
    >
      <div flex="~" justify="start" items="center">
        <Server />
      </div>
      <div flex="~ 1" justify="center" items="center">
        <h1 text="xl" font="bold" select="none">
          I Seek You
        </h1>
      </div>
      <div flex="~" justify="end" items="center">
        <Settings />
      </div>
    </header>
  )
}
