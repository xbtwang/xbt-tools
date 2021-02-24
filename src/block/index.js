import axios from 'axios'
import _ from 'lodash'
import Config from 'config'

class Block {
  constructor() {}

  async init() {}

  async range(start, end) {
    start = parseInt(start)
    end = parseInt(end)
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/block/range`,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          start,
          end,
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

  async height(start, end) {
    start = parseInt(start)
    end = parseInt(end)
    try {
      const res = await axios({
        method: 'post',
        url: `${Config.data.open.host}/open/block/height`,
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {},
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

export default new Block()
