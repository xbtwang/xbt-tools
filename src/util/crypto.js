import crypto from 'crypto'
import {Keccak, SHA3} from 'sha3'

class UtilCrypto {
  sha512(text, out = 'hex') {
    return crypto.createHash('sha512').update(text).digest(out)
  }

  sha256(text, out = 'hex') {
    return crypto.createHash('sha256').update(text).digest(out)
  }

  keccak(text, size, out = 'hex') {
    return new Keccak(size).update(text).digest(out)
  }

  sha3(text, size, out = 'hex') {
    return new SHA3(size).update(text).digest(out)
  }
}

export default new UtilCrypto()
