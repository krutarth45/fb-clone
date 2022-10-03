const cloudinary = require('cloudinary')
const fs = require('fs')
cloudinary.config({
  cloud_name: 'krutarth',
  api_key: '117523832998435',
  api_secret: 'Hv_q0QRXwXT5pQJBkCLy8wxlwPM',
})
exports.uploadImages = async (req, res) => {
  try {
    const { path } = req.body
    let files = Object.values(req.files).flat()
    let images = []
    for (const file of files) {
      const url = await uploadToCloudinary(file, path)
      images.push(url)
      removeTmp(file.tempFilePath)
    }
    res.send(images)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.listImages = async (req, res) => {
  const { path, sort, max } = req.body
  cloudinary.v2.search
    .expression(`${path}`)
    .sort_by('created_at', `${sort}`)
    .max_results(max)
    .execute()
    .then((result) => res.send(result))
    .catch((err) => console.log(err.error.message))
}
const uploadToCloudinary = async (file, path) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      { folder: path },
      (err, res) => {
        if (err) {
          removeTmp(file.tempFilePath)
          return res.status(400).send({ message: 'Upload Failed' })
        }
        resolve({
          url: res.secure_url,
        })
      },
    )
  })
}

const removeTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      throw err
    }
  })
}
