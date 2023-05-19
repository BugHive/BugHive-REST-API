const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  bugs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bug'
    }
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.__id
    delete returnedObject.__id
    delete returnedObject.__v
  }
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag