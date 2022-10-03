const express = require('express')
const { uploadImages, listImages } = require('../controllers/upload')
const { authUser } = require('../middlewares/auth')
const { imageUpload } = require('../middlewares/imageUpload')

const router = express.Router()

router.post('/uploadimages', imageUpload, uploadImages)
router.post('/listimages', authUser, listImages)

module.exports = router
