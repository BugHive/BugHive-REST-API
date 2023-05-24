const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { isValidObjectId } = require('../utils/helper')
const User = require('../models/user')
const Bug = require('../models/bug')
const Tag = require('../models/tag')


const addUser = async (request, response) => {
  const { username, email, password } = request.body

  // validating the password
  if (!password || password.length < 6) {
    return response.status(400).send({
      error: 'password must be at least 6 characters long'
    })
  }

  // generating a password hash
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    email,
    passwordHash
  })

  // saving the user to the database
  const savedUser = await user.save()

  response.status(201).json(savedUser)
}

const getAllUsers = async (request, response) => {
  const users = await User
    .find({})
    .populate('tags', { title: 1, bugs: 1 })
    .populate('bugs', { title: 1, description: 1, lastModified: 1, references: 1, tags: 1 })

  response.json(users)
}

const getUser =  async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('tags', { title: 1, bugs: 1 })
    .populate('bugs', { title: 1, description: 1, lastModified: 1, references: 1, tags: 1 })

  if (!user) {
    return response.status(404).end()
  }

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only view themselves' })
  }

  response.json(user)
}

const deleteUser =  async (request, response) => {
  const user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).end()
  }

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only delete themselves' })
  }

  await Tag.deleteMany({ user: new ObjectId(user.id) })
  await Bug.deleteMany({ user: new ObjectId(user.id) })
  await User.findByIdAndRemove(request.params.id)

  response.status(204).end()
}

const updateUser =  async (request, response) => {
  const body = request.body
  let user = await User.findById(request.params.id)

  if (!user) {
    return response.status(404).end()
  }

  if (user.id !== request.user.id) {
    return response.status(401).json({ error: 'a user can only update themselves' })
  }

  // validating the new password
  if (!body.password || body.password.length < 6) {
    response.status(400).send({
      error: 'password must be at least 6 characters long'
    })
  }

  // generating a password hash
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds)

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


  // validating the new tags
  if(body.tags) {
    for(let tag of body.tags) {
      const validObjectId = await isValidObjectId(tag, Tag, user)
      if(!validObjectId) {
        return response.status(400).json({ error: 'A tag is not a valid tag id' })
      }
      tag = new ObjectId(tag)
    }
  }

  user.username = body.username
  user.email = body.email
  user.passwordHash = passwordHash
  user.darkMode = body.darkMode
  user.bugs = body.bugs || []
  user.tags = body.tags || []
  await user.save()

  response.json(user)
}



module.exports = {
  addUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser
}

