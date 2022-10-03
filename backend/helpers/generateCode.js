exports.generateCode = (length) => {
  var digits = '0123456789'
  let code = ''
  for (let i = 0; i < length; i++) {
    code += digits[Math.floor(Math.random() * 10)]
  }
  return code
}
