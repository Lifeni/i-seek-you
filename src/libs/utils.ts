export const toUint8 = (hex: string) => new TextEncoder().encode(hex)
export const toJSON = (bytes: Uint8Array) =>
  JSON.parse(new TextDecoder().decode(bytes))
export const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, byte => ('0' + (byte & 0xff).toString(16)).slice(-2)).join(
    ''
  )

export const fromHex = (hex: string) => {
  const matches = hex.match(/.{1,2}/g)
  if (matches) return new Uint8Array(matches.map(byte => parseInt(byte, 16)))
  else return new Uint8Array()
}
