import Account from 'account'
import {Crypto} from 'util'

class AccountController {
  async generate(request, reply) {
    const account = await Account.generate()
    return account
  }

  async checkAddress(request, reply) {
    const address = request.body.address
    const check = await Account.checkAddress(address)
    return {
      check: check === address
    }
  }

  async generateAddressByPublic(request, reply) {
    const publicKeyString = request.body.public
    const address = await Account.generateAddress(publicKeyString)
    return {
      address
    }
  }

  async generateAddressBySignature(request, reply) {
    const signature = request.body.signature
    const {publicKeyString} = Account.signatureParse(signature)
    const address = await Account.generateAddress(publicKeyString)
    return {
      address
    }
  }

  async sign(request, reply) {
    const privateKeyString = request.body.private
    const message = request.body.message
    const signature = await Account.signaturen(privateKeyString, message)
    return signature
  }

  async verify(request, reply) {
    const publicKeyString = request.body.public
    const message = request.body.message
    const signature = request.body.signature
    const verify = await Account.verify(publicKeyString, message, signature)
    return verify
  }

  async generateWatch(request, reply) {
    const privateKeyString = request.body.private
    const url = String(request.body.url)
    const payload = await Account.generateWatch(privateKeyString, url)
    return payload
  }

  async sendWatch(request, reply) {
    try {
      const privateKeyString = request.body.private
      const openid = request.body.openid
      const token = request.body.token
      const url = String(request.body.url)
      const payload = await Account.generateWatch(privateKeyString, url)
      const signature = Crypto.sha3(`${payload.hash}${token}`)
      const res = await Account.sendWatch({
        openid,
        signature,
        payload,
      })
      return res
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }

  async balance(request, reply) {
    try {
      const address = request.body.address
      const res = await Account.balance(address)
      return res
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }

}

export default new AccountController()
