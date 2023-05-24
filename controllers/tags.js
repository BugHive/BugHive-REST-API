const { ObjectId } = require('mongodb')
const Bug = require('../models/bug')
const Tag = require('../models/tag')
const { isValidObjectId } = require('../utils/helper')



const addTag =  async (request, response) => {
  const body = request.body
  const user = request.user

  // validating the new bugs
  if(body.bugs) {
    for(let bug of body.bugs) {
      const validObjectId = await isValidObjectId(bug, Bug, user)
      if(!validObjectId) {
        return response.status(400).json({ error: 'A bug is not a valid bug id' })
      }
      bug = new ObjectId(bug)
    }
  }

  const tag = new Tag({
    title: body.title,
    user: new ObjectId(user.id),
    bugs: body.bugs || []
  })
  const savedTag = await tag.save()

  user.tags = user.tags.concat(new ObjectId(savedTag.id))
  await user.save()

  for (let bugId of tag.bugs) {
    const bug = await Bug.findById(bugId.toString())
    bug.tags = bug.tags.concat(new ObjectId(savedTag.id))
    await bug.save()
  }

  response.status(201).json(savedTag)
}

const getAllTags =  async (request, response) => {
  const user = request.user
  const tags = await Tag
    .find({ user: new ObjectId(user.id) })
    .populate('bugs', { title: 1, description: 1, lastModifeid: 1, references: 1 })

  response.json(tags)
}

const getTag = async (request, response) => {
  const user = request.user

  const tag = await Tag
    .findById(request.params.id)
    .populate('bugs', { title: 1, description: 1, lastModifeid: 1, references: 1 })

  if(!tag) {
    response.status(404).end()
  }

  if(tag.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only view their tags' })
  }

  response.json(tag)
}

const deleteAllTags =  async (request, response) => {
  const user = request.user

  await Tag.deleteMany({ user: new ObjectId(user.id) })

  user.tags = []
  await user.save()

  const bugs = await Bug.find({ user: new ObjectId(user.id) })
  for(let bug of bugs) {
    bug.tags = []
    await bug.save()
  }

  response.status(204).end()
}


const deleteTag =  async (request, response) => {
  const user = request.user
  const tag = await Tag.findById(request.params.id)

  if(!tag) {
    return response.status(404).end()
  }

  if(tag.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only delete their tags' })
  }

  await Tag.findByIdAndRemove(request.params.id)

  // remove the tag from user's tags
  user.tags = user.tags.filter(tag => tag.toString() !== request.params.id)
  await user.save()

  // remove the tag from user's bugs
  const tagBugs = await Bug.find({ $and: [ { user: new ObjectId(user.id) }, { tags: new ObjectId(tag.id) } ] })
  for(let tagBug of tagBugs) {
    tagBug.tags = tagBug.tags.filter(tag => tag.toString() !== tag.id)
    await tagBug.save()
  }

  response.status(204).end()
}

const updateTag =  async (request, response) => {
  const body = request.body
  const user = request.user

  const tag = await Tag.findById(request.params.id)

  if(!tag) {
    return response.status(404).end()
  }

  if(tag.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only delete their tags' })
  }

  // validating the new bugs
  if(body.bugs) {
    for(let bug of body.bugs) {
      const validObjectId = await isValidObjectId(bug, Bug, user)
      if(!validObjectId) {
        return response.status(400).json({ error: 'A bug is not a valid bug id' })
      }
      bug = new ObjectId(bug)
    }
  }

  const tagOldBugs = await Bug.find({ $and: [ { user: new ObjectId(user.id) }, { tags: new ObjectId(tag.id) } ] })

  tag.title = body.title
  tag.bugs = body.bugs || []
  await tag.save()

  for(let bug of tagOldBugs) {
    bug.tags = bug.tags.filter(tag => tag.toString() !== tag.id)
  }

  const tagNewBugs = tag.bugs
  for(let bugId of tagNewBugs) {
    const bug = await Bug.findById(bugId.toString())
    bug.tags = bug.tags.concat(new ObjectId(tag.id))
    await bug.save()
  }

  response.json(tag)
}

module.exports = {
  addTag,
  getAllTags,
  getTag,
  deleteAllTags,
  deleteTag,
  updateTag
}