export const toHex = (byteArray: Uint8Array) =>
  Array.from(byteArray, byte =>
    ('0' + (byte & 0xff).toString(16)).slice(-2)
  ).join('')
