const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { ObjectId } = mongoose.Schema
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      minLength: [3, 'Length should be atleast 3'],
      maxLength: [30, 'Length should be less than 31'],
      trim: true,
      required: [true, 'First Name is Required'],
    },
    last_name: {
      type: String,
      minLength: [3, 'Length should be atleast 3'],
      maxLength: [30, 'Length should be less than 31'],
      trim: true,
      required: [true, 'Last Name is Required'],
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: [true, 'User already exists'],
      required: [true, 'Email is Required'],
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"')
        }
      },
    },
    picture: {
      type: String,
      default:
        'https://i1.wp.com/www.baytekent.com/wp-content/uploads/2016/12/facebook-default-no-profile-pic1.jpg?ssl=1',
    },
    cover: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is Required'],
      trim: true,
      enum: ['Male', 'Female', 'Custom'],
    },
    bYear: {
      type: Number,
      required: true,
      trim: true,
    },
    bMonth: {
      type: Number,
      required: true,
      trim: true,
    },
    bDay: {
      type: Number,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    requests: [
      {
        type: ObjectId,
        ref: 'User',
      },
    ],
    search: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    details: {
      bio: {
        type: String,
      },
      othername: {
        type: String,
      },
      job: {
        type: String,
      },
      workplace: {
        type: String,
      },
      highSchool: {
        type: String,
      },
      college: {
        type: String,
      },
      currentCity: {
        type: String,
      },
      hometown: {
        type: String,
      },
      relationship: {
        type: String,
        enum: ['Single', 'Married', 'Engaged', 'Divorsed', 'In a Relationship'],
      },
      instagram: {
        type: String,
      },
    },
    savedPosts: [
      {
        post: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
        },
        savedAt: {
          type: Date,
          required: true,
        },
      },
    ],
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_TOKEN)
  user.token = token
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to login!')
  }
  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    throw new Error('Unable to Login')
  }
  return user
}

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})
// userSchema.index({ first_name: 'text', last_name: 'text', username: 'text' })
const User = mongoose.model('User', userSchema)
// User.createIndexes()
module.exports = User
