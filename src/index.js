import Api from 'api'
import Config from 'config'
async function bootstrap() {
  Config.init({
    open: {
      host: 'https://api.xbt.wang'
    }
  })
  await Api.init({
    logger: process.env.NODE_ENV === 'development',
  })
}

bootstrap().catch((error) => {
  console.log('[xbt] error', error)
})
