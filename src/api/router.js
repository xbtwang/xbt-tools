import AccountController from './controller/account'
import BlockController from './controller/block'
import TransactionController from './controller/transaction'

const router = (app) => {
  app.post('/account/generate', AccountController.generate)
  app.post('/account/address/public', AccountController.generateAddressByPublic)
  app.post(
    '/account/address/signature',
    AccountController.generateAddressBySignature,
  )
  app.post('/account/sign', AccountController.sign)
  app.post('/account/verify', AccountController.verify)
  app.post('/account/balance', AccountController.balance)
  app.post('/account/watch/generate', AccountController.generateWatch)
  app.post('/account/watch/send', AccountController.sendWatch)
  app.post('/block/height', BlockController.height)
  app.post('/block/range', BlockController.range)
  app.post('/transaction/generate', TransactionController.generate)
  app.post('/transaction/send', TransactionController.generateSend)
  app.post('/transaction/get', TransactionController.get)
  app.post('/transaction/log', TransactionController.log)
}

export default router
