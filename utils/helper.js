const { ObjectId } = require('mongoose').Types

const isValidObjectId = async (id, model, user) => {
  if (!ObjectId.isValid(id) || (String)(new ObjectId(id)) !== id) {
    return false
  }
  const object = await model.findOne({ user: new ObjectId(user.id) }, { id: id })
  if(!object) {
    return false
  }
  return new ObjectId(id)
}

module.exports = {
  isValidObjectId
}