const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { validateEmail, validateUsername, validateName } = require('../utils/modelValidation')

const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: 'please enter email',
    validate: [validateEmail, 'please enter valid email']
  },
  username: {
    type: String,
    minlength: [4, 'username must be at least 4 characters long'],
    unique: true,
    required: 'please enter username',
    validate: [validateUsername, 'only letters and numbers allowed']
  },
  firstName: {
    type: String,
    required: 'please enter your name',
    validate: [validateName, 'only letters allowed']
  },
  lastName: {
    type: String,
    required: 'please enter your last name',
    validate: [validateName, 'only letters allowed']
  },
  passwordHash: {
    type: String,
    required: true
  },
  verificationToken: String,
  verified: Date,
  resetToken: {
    token: String,
    expires: Date
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator, { message:  '{PATH} is already taken' });

// gets called in response
userSchema.set('toJSON', {
  // not using virtuals way
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
    delete returnedObject.verificationToken
  }
})

module.exports = mongoose.model('User', userSchema)