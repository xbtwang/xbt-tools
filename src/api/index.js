import fastify from 'fastify'
import fastifyCors from 'fastify-cors'
import router from 'api/router'

class Api {
  constructor() {
  }

  async init(config) {
    this.app = fastify(config)
    await this.start()
  }

  async start() {
    try {
      router(this.app)
      this.app.register(fastifyCors, {
        origin: '*'
      })
      await this.app.listen({
        port: 3000,
        host: '0.0.0.0'
      })
      console.info(`[api] listening on ${this.app.server.address().port}`)
    } catch (err) {
      console.error(err)
    }
  }

}

export default new Api()