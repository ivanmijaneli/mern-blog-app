const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please enter title']
  },
  author: {
    type: String,
    required: [true, 'please enter author']
  },
  url: {
    type: String,
    required: [true, 'please enter url']
  },
  likes: Number,
  likedBy: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [String]
})

// gets called in response
blogSchema.set('toJSON', {
  // adds id
  virtuals: true,
  // removes _v
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject._id
  }
})

module.exports = mongoose.model('Blog', blogSchema)