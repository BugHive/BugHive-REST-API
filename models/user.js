const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { isEmail } = require('validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: isEmail,
      message: 'email must be of the form example@mail.com'
    }
  },
  passwordHash: {
    type: String,
    required: true
  },
  darkMode: Boolean,
  bugs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bug'
    }
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User