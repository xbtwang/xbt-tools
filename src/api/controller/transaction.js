import Transaction from 'transaction'

class TransactionController {
  async generate(request, reply) {
    try {
      const privateKeyString = request.body.private
      const to = request.body.to
      const amount = request.body.amount
      const fee = request.body.fee
      const nonce = request.body.nonce
      const time = request.body.time
      const tx = await Transaction.generate({
        privateKeyString,
        to,
        amount,
        fee,
        nonce,
        time,
      })
      await Transaction.verify(tx)
      return tx
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }

  async generateSend(request, reply) {
    try {
      const privateKeyString = request.body.private
      const to = request.body.to
      const amount = request.body.amount
      const fee = request.body.fee
      const nonce = request.body.nonce
      const time = request.body.time
      const tx = await Transaction.generate({
        privateKeyString,
        to,
        amount,
        fee,
        nonce,
        time,
      })
      await Transaction.verify(tx)
      const res = await Transaction.send(tx)
      return res
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }

}
export default new TransactionController()