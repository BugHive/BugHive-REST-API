const { ObjectId } = require('mongodb')
const tagsRouter = require('express').Router()
const Bug = require('../models/bug')
const Tag = require('../models/tag')


tagsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  const tag = new Tag({
    title: body.title,
    user: new ObjectId(user.id),
    bugs: body.bugs
      ? body.bugs.map(bug => new ObjectId(bug))
      : []
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
})

tagsRouter.get('/', async (request, response) => {
  const user = request.user
  const tags = await Tag
    .find({ user: new ObjectId(user.id) })
    .populate('bugs', { title: 1, description: 1, lastModifeid: 1, references: 1 })

  response.json(tags)
})

tagsRouter.get('/:id', async (request, response) => {
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
})

tagsRouter.delete('/', async (request, response) => {
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
})


tagsRouter.delete('/:id', async (request, response) => {
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
})

tagsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const user = request.user

  const tag = await Tag.findById(request.params.id)

  if(!tag) {
    return response.status(404).end()
  }

  if(tag.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only delete their tags' })
  }

  const tagOldBugs = await Bug.find({ $and: [ { user: new ObjectId(user.id) }, { tags: new ObjectId(tag.id) } ] })

  const newTagData = {
    title: body.title,
    user: new ObjectId(user.id),
    bugs: body.bugs
      ? body.bugs.map(bug => new ObjectId(bug))
      : []
  }
  const updatedTag = await Tag.findByIdAndUpdate(request.params.id, newTagData, { new: true })

  for(let bug of tagOldBugs) {
    bug.tags = bug.tags.filter(tag => tag.toString() !== updatedTag.id)
  }

  const tagNewBugs = newTagData.bugs
  for(let bugId of tagNewBugs) {
    const bug = await Bug.findById(bugId.toString())
    bug.tags = bug.tags.concat(new ObjectId(updatedTag.id))
    await bug.save()
  }

  response.json(updatedTag)
})

module.exports = tagsRouter