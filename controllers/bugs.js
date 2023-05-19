const { ObjectId } = require('mongodb')
const bugsRouter = require('express').Router()
const User = require('../models/user')
const Bug = require('../models/bug')
const Tag = require('../models/tag')
const helper = require('./helper')


bugsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(request.user.id)

  const tags = [] /*await helper.generateTags(body.tags, user)*/

  const bug = new Bug({
    title: body.title,
    description: body.description,
    lastModifeid: body.lastModifeid,
    references: body.references,
    user: user.id,
    tags: tags.map(tag => new ObjectId(tag.id))
  })
  const savedBug = await bug.save()

  for (let tag of tags) {
    tag.bugs = tag.bugs.concat(new ObjectId(savedBug.id))
    await tag.save()
  }

  user.bugs = user.bugs.concat(new ObjectId(savedBug.id))
  await user.save()

  response.status(201).json(savedBug)
})

bugsRouter.get('/', async (request, response) => {
  const user = await User.findById(request.user.id)
  const bugs = await Bug
    .find({ user: new ObjectId(user.id) })
    .populate('tags', { title: 1 })

  response.json(bugs)
})

bugsRouter.get('/:id', async (request, response) => {
  const bug = await Bug
    .findById(request.params.id)
    .populate('tags', { title: 1 })

  if (!bug) {
    return response.status(404).end()
  }

  if (bug.user.toString() !== request.user.id) {
    return response.status(401).json({ error: 'a user can only view their bugs' })
  }

  response.json(bug)
})

bugsRouter.delete('/', async (request, response) => {
  const user = await User.findById(request.user.id)
  const tags = await Tag.find({ user: new ObjectId(user.id) })

  await Bug.deleteMany({ user: new ObjectId(user.id) })

  user.bugs = []
  await user.save()

  for (let tag of tags) {
    tag.bugs = []
    await tag.save()
  }

  response.status(204).end()
})


bugsRouter.delete('/:id', async (request, response) => {
  const user = await User.findById(request.user.id)
  const bug = await Bug.findById(request.params.id)

  if (!bug) {
    return response.status(404).end()
  }
  if (bug.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only delete their bugs' })
  }

  const tags = [] /*await Tag.find({ $and: [{ user: new ObjectId(user.id) }, { bugs: new ObjectId(bug.id) }] })*/

  await Bug.findByIdAndRemove(request.params.id)
  user.bugs = user.bugs.filter(bug => bug.toString() !== request.params.id)
  await user.save()

  for (let tag of tags) {
    tag.bugs = tag.bugs.filter(bug => bug.id.toString() !== request.params.id)
    await tag.save()
  }

  response.status(204).end()
})

bugsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const user = await User.findById(request.user.id)
  const bug = await Bug.findById(request.params.id)

  if (!bug) {
    return response.status(404).end()
  }

  if (bug.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only update their bugs' })
  }

  // const oldTags = await Tag.find({ $and: [{ user: new ObjectId(user.id) }, { bugs: new ObjectId(bug.id) }] })
  // const newTags = await helper.generateTags(body.tags, user)

  const newBugData = {
    title: body.title,
    description: body.description,
    lastModifeid: body.lastModifeid,
    references: body.references,
    // tags: newTags.map(tag => new ObjectId(tag.id))
  }

  const updatedBug = await Bug.findByIdAndUpdate(request.params.id, newBugData, { new: true })

  // for (let tag of oldTags) {
  //   tag.bugs = tag.bugs.filter(bug => bug.id.toString() !== request.params.id)
  //   await tag.save()
  // }

  // for (let tag of newTags) {
  //   tag.bugs = tag.bugs.concat(new ObjectId(bug.id))
  //   await tag.save()
  // }

  response.json(updatedBug)
})


module.exports = bugsRouter