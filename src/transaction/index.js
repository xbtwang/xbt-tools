import Account from 'account'
import axios from 'axios'
import dayjs from 'dayjs'
import _ from 'lodash'
import randomInt from 'random-int'
import NP from 'number-precision'
import Config from 'config'
import {Crypto, Format} from 'util'

class Transaction {
  constructor() {}

  async init() {}

  async generate({privateKeyString, to, amount, fee, nonce, time}) {
    fee = Number(fee)
    if (_.isUndefined(fee) === null || _.isNaN(fee) || fee < 0) {
      fee = this.fee(amount)
    }
    const tx = {
      to: to,
      amount: amount,
      fee: fee,
      nonce: nonce || randomInt(2147483647),
      time: time || dayjs().valueOf(),
    }
    const hash = this.generateHash(tx)
    const sig = await Account.sign(privateKeyString, hash)
    if (!sig) throw '签名失败'
    const insertTx = {
      hash,
      to: tx.to,
      amount: tx.amount,
      fee: tx.fee,
      nonce: tx.nonce,
      time: tx.time,
      sig,
    }
    return insertTx
  }

  generateHash(tx) {
    const txData = [tx.to, tx.amount, tx.fee, tx.nonce, tx.time]
    const txString = JSON.stringify(txData)
    const hash = Crypto.sha3(txString, 256)
    return hash
  }

  fee(amount) {
    if (!amount) return 0.1
    amount = Math.abs(amount)
    if (_.isNaN(amount)) return 0.1
    amount = Format.number(amount)
    let fee = Format.number(NP.times(amount, 0.002))
    if (fee < 0.1) fee = 0.1
    return fee
  }

  async verify(tx) {
    const checkAddress = Account.checkAddress(tx.to)
    if (checkAddress !== tx.to) throw '接收地址效验失败'
    const fixedAmount = Format.number(tx.amount)
    if (tx.amount !== fixedAmount) throw '发送数量效验失败'
    const fixedFee = Format.number(tx.fee)
    if (tx.fee !== fixedFee) throw '手续费数量效验失败'
    const fixedNonce = parseInt(tx.nonce)
    if (tx.nonce !== fixedNonce || tx.nonce > 2147483647) return false
    const hash = this.generateHash(tx)
    if (hash !== tx.hash) throw '交易HASH效验失败'
    const {signature, publicKeyString} = Account.signatureParse(tx.sig)
    const address = Account.generateAddress(publicKeyString)
    if (address === tx.to) throw '接收地址与发送地址不允许相同'
    const verify = await Account.verify(publicKeyString, hash, signature)
    if (!verify) throw '签名效验失败'
  }

  async send(tx) {
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/tx/send`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          tx
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

  async get(hash) {
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/tx`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          hash
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

  async log(hash, address) {
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/tx/log`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          hash,
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

export default new Transaction()
