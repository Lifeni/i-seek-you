// Import syntax currently does not work with Firefox
// in development environment, so use Chromium.
import { SM2, SM2ExchangeA, SM2ExchangeB, SM3, SM4 } from '@lifeni/libsm-js'
import { fromHex, toHex, toUint8 } from '../libs/utils'
import init from '@lifeni/libsm-js'
import wasm from '@lifeni/libsm-js/libsm_js_bg.wasm?url'

init(wasm).then(lib => lib.start())

let sm2: SM2,
  ppk: Uint8Array,
  pk: Uint8Array,
  sk: Uint8Array,
  ra: Uint8Array,
  exchange: SM2ExchangeA | SM2ExchangeB

addEventListener('message', event => {
  const { action, ...props } = event.data

  switch (action) {
    case 'hash': {
      const sm3 = new SM3(toUint8(props.text))
      const hash = sm3.get_hash()
      postMessage({ type: 'hash', hash: toHex(hash) })
      break
    }
    case 'keypair': {
      const sm2 = new SM2()
      const pair = sm2.new_keypair()
      pk = pair.pk
      sk = pair.sk
      postMessage({ type: 'keypair', pk: toHex(pair.pk) })
      break
    }
    case 'encrypt': {
      const key = exchange.get_key()
      const sm4 = new SM4(key)
      const encrypt = sm4.encrypt(props.buffer)
      postMessage({
        type: 'encrypt',
        encrypt,
        id: props.id,
        length: props.length,
      })
      break
    }
    case 'decrypt': {
      const key = exchange.get_key()
      const sm4 = new SM4(key)
      const decrypt = sm4.decrypt(props.buffer)
      postMessage({ type: 'decrypt', decrypt, id: props.id })
      break
    }
    case 'call': {
      const sm3 = new SM3(toUint8(props.text))
      const hash = sm3.get_hash()
      sm2 = new SM2()
      const pair = sm2.new_keypair()
      pk = pair.pk
      sk = pair.sk

      postMessage({ type: 'call', hash: toHex(hash), pk: toHex(pk) })
      break
    }
    case 'answer': {
      const sm3 = new SM3(toUint8(props.text))
      ppk = fromHex(props.ppk)
      const hash = sm3.get_hash()
      postMessage({ type: 'answer', hash: toHex(hash) })
      break
    }
    case 'exchange-1': {
      sm2 = new SM2()
      const pair = sm2.new_keypair()
      pk = pair.pk
      sk = pair.sk

      exchange = new SM2ExchangeA(16, props.id, props.pid, pk, ppk, sk)
      const ra = exchange.exchange1()
      postMessage({ type: 'exchange-1', pk: toHex(pk), ra: toHex(ra) })
      break
    }
    case 'exchange-2': {
      exchange = new SM2ExchangeB(
        16,
        props.pid,
        props.id,
        fromHex(props.ppk),
        pk,
        sk
      )
      ra = fromHex(props.ra)
      const { r_b: rb, s_b: sb } = exchange.exchange2(fromHex(props.ra))
      postMessage({ type: 'exchange-2', rb: toHex(rb), sb: toHex(sb) })
      break
    }
    case 'exchange-3': {
      const ctx = exchange as SM2ExchangeA
      const sa = ctx?.exchange3(fromHex(props.rb), fromHex(props.sb))
      postMessage({ type: 'exchange-3', sa: toHex(sa) })
      break
    }
    case 'exchange-4': {
      const ctx = exchange as SM2ExchangeB
      const result = ctx?.exchange4(ra, fromHex(props.sa))
      postMessage({ type: 'exchange-4', result })
      break
    }
  }
})
