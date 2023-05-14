const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true
  },
  bugs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bug'
    }
  ]
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