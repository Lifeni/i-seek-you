type StyleAttrs = {
  bg?: string
  text?: string
  font?: string
  w?: string
  h?: string
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
  decoration?: string
  rounded?: string | boolean
  shadow?: string
  cursor?: string
  transform?: string | boolean
  transition?: string | boolean
  focus?: string
  filter?: string
  overflow?: string
  outline?: string
  pointer?: string
  leading?: string
  whitespace?: string
  group?: string | boolean
  animate?: string | boolean
  list?: string
  before?: string
  after?: string
  reverse?: boolean
  ring?: string
}

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends StyleAttrs {
      is?: string
    }
    interface SvgSVGAttributes<T> extends StyleAttrs {}
    interface IntrinsicElements {
      'ui-tips': HTMLAttributes<HTMLDivElement>
    }
  }
}

export {}
