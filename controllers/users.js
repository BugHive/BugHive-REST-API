const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Bug = require('../models/bug')
const Tag = require('../models/tag')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

/**
 * posting a user represents registering a new user to the system
 */
usersRouter.post('/', async (request, response) => {
  const { username, email, password } = request.body

  if (!password || password.length < 6) {
    return response.status(400).send({
      error: 'password must be at least 6 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    email,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)

})

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('tags', { title: 1, bugs: 1 })
    .populate('bugs', { title: 1, description: 1, lastModified: 1, references: 1, tags: 1 })

  response.json(users)
})

usersRouter.get('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = await User
    .findOne({ username: request.user.username })
    .populate('tags', { title: 1, bugs: 1 })
    .populate('bugs', { title: 1, description: 1, lastModified: 1, references: 1, tags: 1 })

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only view themselves' })
  }

  response.json(user)
})

usersRouter.delete('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = await User.findById(request.params.id)

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only delete themselves' })
  }

  await Tag.deleteMany({ user: new ObjectId(user.id) })
  await Bug.deleteMany({ user: new ObjectId(user.id) })
  await User.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

usersRouter.put('/:id', tokenExtractor, userExtractor, async (request, response) => {
  const user = await User.findById(request.params.id)

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only update themselves' })
  }

  if (!request.body.password || request.body.password.length < 6) {
    response.status(400).send({
      error: 'password must be at least 6 characters long'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

  const updatedUserData = {
    username: request.body.username,
    email: request.body.email,
    passwordHash,
    darkMode: request.body.darkMode,
  }

  const updatedUser = await User.findByIdAndUpdate(request.params.id, updatedUserData, { new: true })
  response.json(updatedUser)
})

module.exports = usersRouter

