const React = require('../models/react')
const User = require('../models/user')
const mongoose = require('mongoose')
exports.reactPost = async (req, res) => {
  try {
    const { postId, react } = req.body
    const check = await React.findOne({
      postRef: postId,
      reactBy: mongoose.Types.ObjectId(req.user._id),
    })
    if (check === null) {
      const newReact = new React({
        react,
        postRef: postId,
        reactBy: req.user._id,
      })
      await newReact.save()
    } else {
      if (check.react === react) {
        await React.findByIdAndRemove(check._id)
      } else {
        await React.findByIdAndUpdate(check._id, {
          react,
        })
      }
    }
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
exports.getReacts = async (req, res) => {
  try {
    let reacts = []
    let total = 0
    const reactions = await React.aggregate([
      {
        $match: {
          postRef: mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $group: {
          _id: { postId: '$postRef', react: '$react' },
          count: { $count: {} },
        },
      },
    ])
    reactions.forEach((item) => {
      total = item.count + total
      const subItem = { react: item._id.react, count: item.count }
      reacts.push(subItem)
    })
    let like = reacts.findIndex((x) => x.react === 'like')
    if (like === -1) {
      reacts.push({ react: 'like', count: 0 })
    }
    let love = reacts.findIndex((x) => x.react === 'love')
    if (love === -1) {
      reacts.push({ react: 'love', count: 0 })
    }
    let wow = reacts.findIndex((x) => x.react === 'wow')
    if (wow === -1) {
      reacts.push({ react: 'wow', count: 0 })
    }
    let sad = reacts.findIndex((x) => x.react === 'sad')
    if (sad === -1) {
      reacts.push({ react: 'sad', count: 0 })
    }
    let haha = reacts.findIndex((x) => x.react === 'haha')
    if (haha === -1) {
      reacts.push({ react: 'haha', count: 0 })
    }
    let angry = reacts.findIndex((x) => x.react === 'angry')
    if (angry === -1) {
      reacts.push({ react: 'angry', count: 0 })
    }
    reacts.sort((a, b) => {
      return b.count - a.count
    })
    const check = await React.findOne({
      postRef: req.params.id,
      reactBy: req.user._id,
    })
    const user = await User.findById(req.user.id)
    const checkSaved = user?.savedPosts.find(
      (x) => x.post.toString() === req.params.id,
    )
    return res.status(200).send({
      reacts,
      check: check?.react,
      total,
      checkSaved: checkSaved ? true : false,
    })
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
}
