import Parameter from 'parameter'

const parameter = new Parameter({
  validateRoot: true
})

const rule = {
  transaction: {
    data: 'object',
    version: 'string',
    time: 'number',
    nonce: 'number'
  }
}

const validate = (type, data) => {
  const validateRule = typeof type === 'string' ? rule[type] : type
  if (!validateRule) return false
  const v = parameter.validate(validateRule, data)
  if (!v) return true
  return false
}

export default validate
