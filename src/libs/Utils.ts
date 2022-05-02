export const toUint8 = (hex: string) => new TextEncoder().encode(hex)
export const toString = (bytes: Uint8Array) => new TextDecoder().decode(bytes)
export const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, byte => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(
    ''
  )
