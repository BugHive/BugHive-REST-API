const Tag = require('../models/tag')
const { ObjectId } = require('mongodb')

const generateTags = async (tagTitles, user) => {
  let tags = []
  for (let tagTitle of tagTitles) {
    // let tagObject = await Tag.findOne({ $and: [{ user: new ObjectId(user.id) }, { title: tagTitle }] })
    // if (!tagObject) {
    //   tagObject = new Tag({
    //     title: tagTitle,
    //     user: user.id
    //   })
    //   await tagObject.save()
    //   user.tags = user.tags.concat(new ObjectId(tagObject.id))
    // }
    tags = tags.concat(tagObject)
  }
  return tags
}

module.exports = {
  generateTags
}