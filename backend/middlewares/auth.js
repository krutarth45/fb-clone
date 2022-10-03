const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.authUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    if (!token) {
      res.status(400).send({ message: 'Invalid' })
    }
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findOne({
      _id: decoded._id,
      token: token,
    })
    if (!user) {
      throw new Error()
    }
    req.token = token
    req.user = user
    next()
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
