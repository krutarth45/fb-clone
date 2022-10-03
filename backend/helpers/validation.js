const User = require('../models/user')

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/)
}
exports.validateUsername = async (username) => {
  let a = false

  do {
    let check = await User.findOne({ username })
    if (check) {
      //change username
      username += (+new Date() * Math.random()).toString().substring(0, 1)
      a = true
    } else {
      a = false
    }
  } while (a)
  return username
}
