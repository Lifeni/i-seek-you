/* eslint-disable @typescript-eslint/no-unused-vars */
import { IconTypes } from 'solid-icons'
import 'solid-js'
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
  | 'aspect'
  | 'resize'
  | 'pointer'

interface StyleAttrs
  extends Partial<Record<ExtendNames, string>>,
    AttributifyAttributes {}

declare module 'solid-js' {
  namespace JSX {
    interface HTMLAttributes<T> extends StyleAttrs {
      icon?: IconTypes
    }
    interface SvgSVGAttributes<T> extends AttributifyAttributes {}
  }
}

export type Peer = {
  id: string
  emoji: string
  name: string
  password: boolean
}

export type ConnectionName = 'data-channel' | 'media-stream'

export type WebSocketType = {
  Ok: { type: 'ok' }
  Error: { type: 'error'; message: string }
  Id: { type: 'id'; id: string }
  Lobby: { type: 'lobby'; peers: Peer[] }
  Peer: { type: 'peer'; peer: Peer }
  Call: { type: 'call'; peer: Peer; password: string; pk: string }
  Answer: { type: 'answer'; pk: string; ra: string }
  ExchangeA: { type: 'exchange-a'; rb: string; sb: string }
  ExchangeB: { type: 'exchange-b'; sa: string }
  Sdp: { type: 'sdp'; sdp: RTCSessionDescriptionInit; name: ConnectionName }
  Ice: { type: 'ice'; candidate: RTCIceCandidateInit; name: ConnectionName }
  Media: { type: 'media' }
}

export type TextMessage = {
  id: string
  type: 'text'
  date: string
  from: string
  content: string
}

export type FileMessage = {
  id: string
  type: 'file'
  date: string
  from: string
  file: {
    id: string
    name: string
    size: number
    type: string
    hash: string
  }
}

export type FileBlob = {
  id: string
  name: string
  size: number
  type: string
  progress: number
  hash: string
  blob: Blob | null
}

export type Keypair = {
  pk: Uint8Array
  sk: Uint8Array

  ra: Uint8Array
  rb: Uint8Array
  sa: Uint8Array
  sb: Uint8Array

  ppk: Uint8Array // Peer Public Key
  key: Uint8Array // Final Key
}

declare module 'virtual:pwa-register/solid' {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ignore when solid-js is not installed
  import type { Accessor, Setter } from 'solid-js'

  export interface RegisterSWOptions {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onRegisterError?: (error: any) => void
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: [Accessor<boolean>, Setter<boolean>]
    offlineReady: [Accessor<boolean>, Setter<boolean>]
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}
