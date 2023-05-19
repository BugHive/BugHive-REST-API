const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const tagSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
    uniuqe: true
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

tagSchema.plugin(uniqueValidator)

tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject.__id
    delete returnedObject.__id
    delete returnedObject.__v
  }
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag