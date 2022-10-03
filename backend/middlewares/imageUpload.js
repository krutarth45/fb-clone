const fs = require('fs')
exports.imageUpload = async (req, res, next) => {
  try {
    if (!req.files || Object.values(req.files).flat().length === 0) {
      return res.status(400).send({ message: 'No file selected.' })
    }
    let files = Object.values(req.files).flat()
    files.forEach((file) => {
      if (
        file.mimetype !== 'image/jpeg' &&
        file.mimetype !== 'image/jpg' &&
        file.mimetype !== 'image/png' &&
        file.mimetype !== 'image/gif' &&
        file.mimetype !== 'image/webp'
      ) {
        removeTmp(file.tempFilePath)
        return res.status(400).send({ message: 'File Format not supported' })
      }
      if (file.size > 1024 * 1024 * 5) {
        removeTmp(file.tempFilePath)
        return res
          .status(400)
          .send({ message: 'File size should less than 2 Mb' })
      }
    })
    next()
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err
    }
  })
}
