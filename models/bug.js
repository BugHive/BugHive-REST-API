const mongoose = require('mongoose')

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    minlength: 10
  },
  lastModifeid: {
    type: Date,
    default: Date.now
  },
  references: [
    {
      type: String
    }
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      required: true
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

bugSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Bug = mongoose.model('Bug', bugSchema)

module.exports = Bug