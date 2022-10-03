const express = require('express')
const { reactPost, getReacts } = require('../controllers/react')
const { authUser } = require('../middlewares/auth')

const router = express.Router()

router.put('/reactpost', authUser, reactPost)
router.get('/getreacts/:id', authUser, getReacts)

module.exports = router
