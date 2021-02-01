class UtilJson {
  
  stringify (o) {
    let newObject = {}
    Object.keys(o).sort().forEach(x => newObject[x] = o[x])
    return JSON.stringify(newObject)
  }

  parse (s) {
    return JSON.parse(s)
  }

}

export default new UtilJson()
