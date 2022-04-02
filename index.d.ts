/* eslint-disable @typescript-eslint/no-unused-vars */

interface StyleAttrs {
  bg?: string
  text?: string
  font?: string
  w?: string
  'max-w'?: string
  'min-w'?: string
  h?: string
  'max-h'?: string
  'min-h'?: string
  left?: string
  right?: string
  top?: string
  bottom?: string
  z?: string
  pos?: string
  display?: string
  flex?: string
  grid?: string
  p?: string
  m?: string
  border?: string
  items?: string
  justify?: string
  align?: string
  gap?: string
  select?: string
  place?: string
  underline?: string
  rounded?: string
  shadow?: string
  cursor?: string
  transform?: string
  transition?: string
  focus?: string
  touch?: string
  filter?: string
  overflow?: string
  opacity?: string
  outline?: string
  pointer?: string
  leading?: string
  whitespace?: string
  group?: string
  animate?: string
  list?: string
  before?: string
  after?: string
  reverse?: boolean
  ring?: string
  backdrop?: string
  aspect?: string
  resize?: string
}

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends StyleAttrs {}
    interface SvgSVGAttributes<T> extends StyleAttrs {}
  }
}

export {}
