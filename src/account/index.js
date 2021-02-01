import dayjs from 'dayjs'
import eccrypto from 'eccrypto'
import axios from 'axios'
import _ from 'lodash'
import randomInt from 'random-int'
import Config from 'config'
import {Crypto} from 'util'

class Account {
  constructor() {}

  async generate() {
    const privateKey = eccrypto.generatePrivate()
    const publicKey = this.getPublicKey(privateKey)
    const privateKeyString = privateKey.toString('hex')
    const publicKeyString = publicKey.toString('hex')
    return {
      address: this.generateAddress(publicKeyString),
      publicKeyString,
      privateKeyString,
    }
  }

  generateAddress(publicKey) {
    if (typeof publicKey === 'string') {
      publicKey = Buffer.from(publicKey, 'hex')
    }
    const publicHash = Crypto.sha3(publicKey, 256)
    const publicHashCode = publicHash.substring(0, 40)
    const address = 'xB' + publicHashCode
    return this.checkAddress(address)
  }

  checkAddress(address) {
    if (_.size(address) !== 42) return null
    const content = address.toLowerCase().replace(/xb/, '')
    const hash = Crypto.sha3(content, 256)
    const hashCode = hash.substring(hash.length - content.length, hash.length)
    let returnAddress = 'xB'
    for (var i = 0; i < content.length; i++) {
      if (parseInt(hashCode[i], 16) >= 8) {
        returnAddress += content[i].toUpperCase()
      } else {
        returnAddress += content[i]
      }
    }
    return returnAddress
  }

  getPublicKey(privateKey) {
    try {
      if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex')
      }
      return eccrypto.getPublic(privateKey)
    } catch (error) {
      return null
    }
  }

  async sign(privateKey, message) {
    try {
      if (typeof privateKey === 'string') {
        privateKey = Buffer.from(privateKey, 'hex')
      }
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      const publicKey = this.getPublicKey(privateKey)
      if (!publicKey) throw ''
      const publicKeyString = publicKey.toString('hex')
      const messageHash = Crypto.sha3(message, 256, 'binary')
      const sig = await eccrypto.sign(privateKey, messageHash)
      return sig.toString('hex') + '@' + publicKeyString
    } catch (error) {
      return null
    }
  }

  async verify(publicKey, message, signature) {
    try {
      if (typeof publicKey === 'string') {
        publicKey = Buffer.from(publicKey, 'hex')
      }
      if (typeof message === 'object') {
        message = JSON.stringify(message)
      }
      const sig = Buffer.from(signature, 'hex')
      const messageHash = Crypto.sha3(message, 256, 'binary')
      await eccrypto.verify(publicKey, messageHash, sig)
      return true
    } catch (error) {
      return false
    }
  }

  signatureParse(sigString) {
    const signatureArray = sigString.split('@')
    return {
      signature: signatureArray[0],
      publicKeyString: signatureArray[1],
    }
  }

  async generateWatch(privateKeyString, url, nonce, time) {
    const data = {
      type: 'xbt-watch-api',
      url: url,
      nonce: nonce || randomInt(2147483647),
      time: time || dayjs().valueOf(),
    }
    const dataString = JSON.stringify([
      data.type,
      data.url,
      data.nonce,
      data.time,
    ])
    const hash = Crypto.sha3(dataString, 256)
    const sig = await this.sign(privateKeyString, hash)
    if (!sig) throw '签名失败'
    const watchData = {
      hash,
      type: data.type,
      url: data.url,
      nonce: data.nonce,
      time: data.time,
      sig,
    }
    return watchData
  }

  async sendWatch(data) {
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/watch`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      })
      if (res.status !== 200) {
        throw '网络连接失败'
      }
      if (res.data.code !== 200) {
        throw res.data.message
      }
      return res.data
    } catch (error) {
      throw error
    }
  }

  async balance(address) {
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/balance`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          address
        },
      })
      if (res.status !== 200) {
        throw '网络连接失败'
      }
      if (res.data.code !== 200) {
        throw res.data.message
      }
      return res.data
    } catch (error) {
      throw error
    }
  }
}

export default new Account()
