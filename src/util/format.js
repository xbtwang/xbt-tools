class UtilJson {
  number(num) {
    if (typeof num !== 'number') num = Number(num)
    if (isNaN(num)) num = 0
    return Number((Math.round(num * 1000000) / 1000000).toFixed(6))
  }
}

export default new UtilJson()
