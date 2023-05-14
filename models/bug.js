const mongoose = require('mongoose')

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
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
      ref: 'Tag'
    }
  ]
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