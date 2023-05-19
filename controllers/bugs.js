const { ObjectId } = require('mongodb')
const bugsRouter = require('express').Router()
const User = require('../models/user')
const Bug = require('../models/bug')
const Tag = require('../models/tag')


bugsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findOne({ username: request.user.username })
  const bug = new Bug({
    title: body.title,
    description: body.description,
    lastModifeid: body.lastModifeid,
    references: body.references,
    user: user.id,
  })
  const savedBug = await bug.save()

  let tags = []
  const tagTitles = body.tags
  for (let tagTitle of tagTitles) {
    let tagObject = await Tag.findOne({ title: tagTitle })
    if (!tagObject) {
      tagObject = new Tag({
        title: tagTitle,
        user: user.id
      })
      await tagObject.save()
    }
    tags = tags.concat(tagObject)
  }
  savedBug.tags = tags.map(tag => tag.id)
  await savedBug.save()
  for (let tag of tags) {
    tag.bugs = tag.bugs.concat(savedBug.id)
    await tag.save()
  }

  user.bugs = user.bugs.concat(savedBug.id)
  await user.save()

  response.status(201).json(savedBug)
})

bugsRouter.get('/', async (request, response) => {
  const user = await User.findOne({ username: request.user.username })
  const bugs = await Bug
    .find({ user: new ObjectId(user.id) })
    .populate('tags', { title: 1 })

  response.json(bugs)
})

bugsRouter.get('/:id', async (request, response) => {
  const bug = await Bug
    .findById(request.params.id)
    .populate('tags', { title: 1 })

  if (bug) {
    response.json(bug)
  } else {
    response.status(404).end(0)
  }
})










module.exports = bugsRouter