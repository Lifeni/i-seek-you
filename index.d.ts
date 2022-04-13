/* eslint-disable @typescript-eslint/no-unused-vars */
import { AttributifyAttributes } from 'windicss/types/jsx'

type ExtendNames =
  | 'max-w'
  | 'min-w'
  | 'max-h'
  | 'min-h'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'rounded'
  | 'touch'
  | 'leading'
  | 'whitespace'
  | 'group'
  | 'list'
  | 'aspect'
  | 'resize'
  | 'pointer'

interface StyleAttrs
  extends Partial<Record<ExtendNames, string>>,
    AttributifyAttributes {}

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends StyleAttrs {}
    interface SvgSVGAttributes<T> extends AttributifyAttributes {}
  }
}

export type Peer = {
  id: string
  emoji: string
  name: string
  password: boolean
}

export type WsType = {
  Ok: { type: 'ok' }
  Error: { type: 'error'; message: string }
  Id: { type: 'id'; id: string }
  Lobby: { type: 'lobby'; peers: Peer[] }
  Peer: { type: 'peer'; peer: Peer }
  Call: { type: 'call'; peer: Peer; password: string }
}
