import Block from 'block'

class BlockController {
  async range(request, reply) {
    try {
      const start = request.body.start
      const end = request.body.end
      const blockList = await Block.range(start, end)
      return blockList
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }
  async height(request, reply) {
    try {
      const blockList = await Block.height()
      return blockList
    } catch (error) {
      throw {
        error: true,
        message: error,
      }
    }
  }
}
export default new BlockController()
