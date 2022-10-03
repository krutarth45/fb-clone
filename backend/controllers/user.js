const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Code = require('../models/code')
const { sendVerificationEmail, sendResetCode } = require('../helpers/mailer')
const { generateToken } = require('../helpers/tokens')
const { validateUsername, validateEmail } = require('../helpers/validation')
const User = require('../models/user')
const Post = require('../models/post')
const { generateCode } = require('../helpers/generateCode')

exports.register = async (req, res) => {
  try {
    let tempUsername = req.body.first_name + req.body.last_name
    let newUsername = await validateUsername(tempUsername)
    if (validateEmail(req.body.email)) {
      const check = await User.findOne({ email: req.body.email })
      if (check) {
        return res.status(400).send({ message: 'User Already Exists' })
      } else {
        const user = new User({
          ...req.body,
          username: newUsername,
        })
        const registerToken = generateToken({ id: user._id.toString() }, '1d')
        const url = `${process.env.BASE_URL}/activate/${registerToken}`
        sendVerificationEmail(user.email, user.first_name, url)
        const token = await user.generateAuthToken()
        return res.status(201).send({
          id: user._id,
          username: user.username,
          picture: user.picture,
          first_name: user.first_name,
          last_name: user.last_name,
          verified: user.verified,
          token,
          message:
            'Registration Successful! Please Activate your Email. Thank You.',
        })
      }
    } else {
      return res.status(400).send({
        message: 'Invalid Email',
      })
    }
  } catch (error) {
    res.status(400).send({
      message: 'Registration Unsuccessful!',
    })
  }
}
exports.activateAccount = async (req, res) => {
  try {
    const validUserId = req.user._id
    const { token } = req.body
    const decoded = jwt.verify(token, process.env.JWT_TOKEN)
    const user = await User.findOne({
      _id: decoded.id,
    })
    if (user._id.toString() !== validUserId.toString()) {
      return res
        .status(400)
        .send({ message: "You Don't have Authorization to use this Link." })
    }
    if (user.verified) {
      return res
        .status(400)
        .send({ message: 'You have already verified your email.' })
    }
    await user.updateOne({ $set: { verified: true } })
    res
      .status(200)
      .send({ message: 'You have successfully verified your email' })
  } catch (error) {
    res.status(400).send({ message: 'Account Activation Unsuccessful.' })
  }
}
exports.sendVerification = async (req, res) => {
  try {
    const registerToken = generateToken({ id: req.user._id.toString() }, '1d')
    const url = `${process.env.BASE_URL}/activate/${registerToken}`
    sendVerificationEmail(req.user.email, req.user.first_name, url)
    return res
      .status(200)
      .send({ message: 'Email Verification Link has been sent' })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.logIn = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send({
      message: 'Login Failed.',
    })
  }
}
exports.findUser = async (req, res) => {
  try {
    const check = await User.findOne({
      email: req.body.email,
    }).select('-password')
    if (!check) {
      return res.status(400).send({ message: 'Account Does not Exists.' })
    }
    return res.status(200).send({
      email: check.email,
      picture: check.picture,
    })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.sendResetPasswordCode = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    })
    await Code.findOneAndRemove({ user: user._id })
    const code = generateCode(6)
    const savedCode = await new Code({
      code,
      user: user._id,
    })
    await savedCode.save()
    sendResetCode(user.email, user.first_name, code)
    return res
      .status(200)
      .send({ message: 'Verification Code has been sent your Email.' })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.validateResetCode = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const dbCode = await Code.findOne({ user: user._id })
    if (dbCode.code !== req.body.code) {
      return res.status(400).send({
        message: 'Wrong Verification Code',
      })
    }
    return res.status(200).send('Success')
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.changePassword = async (req, res) => {
  try {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 8)
    await User.findOneAndUpdate({ email }, { password: hashedPassword })
    return res.status(200).send('Success')
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.getProfile = async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findById(req.user._id)
    const profile = await User.findOne({ username }).select('-password')
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    }
    if (!profile) {
      return res.send({ ok: false })
    }
    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true
    }
    const posts = await Post.find({ user: profile._id })
      .populate('user')
      .populate(
        'comments.commentBy',
        'first_name last_name picture username commentAt',
      )
      .sort({ createdAt: -1 })
    await profile.populate('friends', 'first_name last_name username picture')
    res.send({ ...profile.toObject(), posts, friendship })
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body
    await User.findByIdAndUpdate(req.user._id, {
      picture: url,
    })
    res.send(url)
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body
    await User.findByIdAndUpdate(req.user._id, {
      cover: url,
    })
    res.send(url)
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.updateDetails = async (req, res) => {
  try {
    const { infos } = req.body
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { details: infos },
      { new: true },
    )
    res.send(updated.details)
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.addFriend = async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      const sender = await User.findById(req.user._id)
      const receiver = await User.findById(req.params.id)
      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        })
        await receiver.updateOne({
          $push: { followers: sender._id },
        })
        await sender.updateOne({
          $push: { following: receiver._id },
        })
        return res.send({ message: 'Friend Request Sent.' })
      } else {
        if (receiver.requests.includes(sender._id)) {
          return res
            .status(400)
            .send({ message: 'You have already sent a Friend Request.' })
        } else {
          return res.status(400).send({ message: 'You are already a Friend.' })
        }
      }
    } else {
      return res
        .status(400)
        .send({ message: 'You cannot send Friend Request to yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.cancelRequest = async (req, res) => {
  try {
    if (req.user._id !== req.params.id) {
      const sender = await User.findById(req.user._id)
      const receiver = await User.findById(req.params.id)
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        })
        await receiver.updateOne({
          $pull: { followers: sender._id },
        })
        await sender.updateOne({
          $pull: { following: receiver._id },
        })
        return res.send({ message: 'Friend Request Cancelled.' })
      } else {
        if (!receiver.requests.includes(sender._id)) {
          return res
            .status(400)
            .send({ message: "You haven't sent a Friend Request yet." })
        } else {
          return res.status(400).send({ message: 'You are already a Friend.' })
        }
      }
    } else {
      return res
        .status(400)
        .send({ message: 'You cannot cancel Friend Request to yourself.' })
    }
  } catch (error) {}
}
exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user._id)
      const sender = await User.findById(req.params.id)
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id, following: sender._id },
        })
        await sender.updateOne({
          $push: { friends: receiver._id, followers: receiver._id },
        })
        await receiver.updateOne({
          $pull: { requests: sender._id },
        })
        return res.send({ message: 'Request Accepted Successfully.' })
      } else {
        return res.status(400).send({
          message: "Request Doesn't Exists.",
        })
      }
    } else {
      return res
        .status(400)
        .send({ message: 'You cannot have your own request to yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user._id)
      const receiver = await User.findById(req.params.id)
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        })
        await sender.updateOne({
          $push: { following: receiver._id },
        })
        return res.send({ message: 'Followed Successfully.' })
      } else {
        return res.status(400).send({
          message: `You are already following ${receiver.first_name} ${receiver.last_name}`,
        })
      }
    } else {
      return res.status(400).send({ message: 'You cannot follow yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user._id)
      const receiver = await User.findById(req.params.id)
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        })
        await sender.updateOne({
          $pull: { following: receiver._id },
        })
        return res.send({ message: 'Unfollowed Successfully.' })
      } else {
        return res.status(400).send({
          message: `You are already not following ${receiver.first_name} ${receiver.last_name}`,
        })
      }
    } else {
      return res.status(400).send({ message: 'You cannot unfollow yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user._id)
      const receiver = await User.findById(req.params.id)
      if (
        sender.friends.includes(receiver._id) &&
        receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: {
            friends: sender._id,
            followers: sender._id,
            following: sender._id,
          },
        })
        await sender.updateOne({
          $pull: {
            friends: receiver._id,
            followers: receiver._id,
            following: receiver._id,
          },
        })
        return res.send({ message: 'Unfriend Successful.' })
      } else {
        return res.status(400).send({
          message: 'Already Not a friend',
        })
      }
    } else {
      return res
        .status(400)
        .send({ message: 'You cannot have unfriend yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user._id)
      const sender = await User.findById(req.params.id)
      if (
        sender.following.includes(receiver._id) &&
        receiver.requests.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: {
            requests: sender._id,
            followers: sender._id,
          },
        })
        await sender.updateOne({
          $pull: {
            following: receiver._id,
          },
        })
        return res.send({ message: 'Request Deleted Successfully.' })
      } else {
        return res.status(400).send({
          message: "Request hasn't been received",
        })
      }
    } else {
      return res
        .status(400)
        .send({ message: 'You cannot have friend request for yourself.' })
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    })
  }
}
exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm
    const results = await User.find({ $text: { $search: searchTerm } }).select(
      'first_name last_name username picture',
    )
    res.send(results)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body
    const search = {
      user: searchUser,
      createdAt: new Date(),
    }
    const user = await User.findById(req.user.id)
    const check = user.search.find((x) => x.user.toString() === searchUser)
    if (check) {
      await User.updateOne(
        {
          _id: req.user.id,
          'search._id': check._id,
        },
        {
          $set: { 'search.$.createdAt': new Date() },
        },
      )
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select('search')
      .populate('search.user', 'first_name last_name picture username')
    res.send(results.search)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body
    await User.updateOne(
      {
        _id: req.user.id,
      },
      {
        $pull: {
          search: { user: searchUser },
        },
      },
    )
    const results = await User.findById(req.user.id)
      .select('search')
      .populate('search.user', 'first_name last_name picture username')
    res.send(results.search)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
exports.getFriendsPageInfos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('friends requests')
      .populate('friends', 'first_name last_name picture username')
      .populate('requests', 'first_name last_name picture username')
    const sentRequests = await User.find({
      requests: mongoose.Types.ObjectId(req.user.id),
    }).select('first_name last_name username picture')
    return res.send({
      friends: user.friends,
      requests: user.requests,
      sentRequests,
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
