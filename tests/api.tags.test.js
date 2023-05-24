const supertest = require('supertest')
const mongoose = require('mongoose')
const { ObjectId } = require('mongodb')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const Bug = require('../models/bug')
const Tag = require('../models/tag')

let user1 = null
let user2 = null
let user1Headers = null
let user2Headers = null

const initialTags = [
  {
    title: 'Memory'
  },
  {
    title: 'Security'
  }
]

beforeAll(async () => {
  await User.deleteMany({})

  // registering first test user
  user1 = {
    username: 'test1',
    email: 'test1@gmail.com',
    password: 'test1password'
  }
  const response1 = await api
    .post('/api/users')
    .send(user1)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  initialTags[0].user = new ObjectId(response1.body.id)

  // registering second test user
  user2 = {
    username: 'test2',
    email: 'test2@gmail.com',
    password: 'test2password'
  }
  const response2 = await api
    .post('/api/users')
    .send(user2)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  initialTags[1].user = new ObjectId(response2.body.id)


  // logging in user1
  const loginResponse1 = await api
    .post('/api/login')
    .send(user1)

  // logging in user2
  const loginResponse2 = await api
    .post('/api/login')
    .send(user2)

  user1Headers = {
    'Authorization': `bearer ${loginResponse1.body.token}`
  }

  user2Headers = {
    'Authorization': `bearer ${loginResponse2.body.token}`
  }

}, 10000)

/**
 * test /api/tags endpoints
 */
describe('testing /api/tags different endpoints', () => {
  let users = null
  let tags = null

  beforeEach(async () => {
    await Bug.deleteMany({})
    await Tag.deleteMany({})
    await Tag.insertMany(initialTags)

    tags = await Tag.find({})
    users = await User.find({})
    await User.findByIdAndUpdate(users[0].id, { ...user1, tags: [new ObjectId(tags[0].id)] })
    await User.findByIdAndUpdate(users[1].id, { ...user2, tags: [new ObjectId(tags[1].id)] })
  }, 10000)

  describe('POST /api/tags - testing adding new tags', () => {
    test('a valid tag with a logged in user is added', async () => {
      const tagData = {
        title: 'Hardware'
      }

      const response = await api
        .post('/api/tags')
        .send(tagData)
        .set(user1Headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalTags = await Tag.find({})
      expect(finalTags).toHaveLength(initialTags.length + 1)

      const tagTitles = finalTags.map(tag => tag.title)
      expect(tagTitles).toContain(tagData.title)

      expect(response.body.user).toEqual(users[0].id)

      const posterUser = await User.findById(users[0].id)
      expect(posterUser.tags).toContainEqual(new ObjectId(response.body.id))
    }, 10000)

    test('a valid tag with associated bug is added', async () => {
      const bugData = {
        title: 'cpu fan error',
        description: 'the fan is very noisy',
      }

      const bugResponse = await api
        .post('/api/bugs')
        .send(bugData)
        .set(user1Headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const bugId = bugResponse.body.id

      const finalBugs = await Bug.find({ user: new ObjectId(users[0].id ) })
      expect(finalBugs.map(bug => bug.id)).toContain(bugId)

      const tagData = {
        title: 'Hardware',
        bugs: [bugId]
      }

      const tagResponse = await api
        .post('/api/tags')
        .send(tagData)
        .set(user1Headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalTags = await Tag.find({})
      expect(finalTags).toHaveLength(initialTags.length + 1)

      const tagTitles = finalTags.map(tag => tag.title)
      expect(tagTitles).toContain(tagData.title)

      expect(tagResponse.body.user).toEqual(users[0].id)

      const posterUser = await User.findById(users[0].id)
      expect(posterUser.tags).toContainEqual(new ObjectId(tagResponse.body.id))

      expect(tagResponse.body.bugs).toContain(bugId)

      const updatedBug = await Bug.findById(bugId)
      expect(updatedBug.tags).toContainEqual(new ObjectId(tagResponse.body.id))

    }, 10000)

    test('a valid tag without a valid jwt token is not added', async () => {
      const tagData = {
        title: 'Hardware'
      }

      const response = await api
        .post('/api/tags')
        .send(tagData)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toEqual('token missing')

      const finalTags = await Tag.find({})
      expect(finalTags).toHaveLength(initialTags.length)
    }, 1000)
  })

  describe('GET /api/tags - testing getting tags', () => {
    test('all tags of a specific user with a valid token are returned as json', async () => {

      const response = await api
        .get('/api/tags')
        .set(user2Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(users[1].tags.length)
    }, 10000)

    test('a tag of a specific user is returned if a valid token is sent', async () => {
      const response = await api
        .get(`/api/tags/${tags[1].id}`)
        .set(user2Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toEqual(tags[1].title)
      expect(response.body.user).toEqual(users[1].id)

    }, 10000)

    test('a tag of a specific user can only be viewed by them', async () => {

      const response = await api
        .get(`/api/tags/${tags[0].id}`)
        .set(user2Headers)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toEqual('a user can only view their tags')
    }, 10000)
  })

  describe('DELETE /api/tags - testing deleting tags', () => {
    test('all tags of a specific user are deleted if a valid token of their own is sent', async () => {
      await api
        .delete('/api/tags')
        .set(user2Headers)
        .expect(204)

      const finalUser1Tags = await Tag.find({ user: new ObjectId(users[1].id) })
      expect(finalUser1Tags).toHaveLength(0)

      const finalUser1 = await User.findById(users[1].id)
      expect(finalUser1.tags).toHaveLength(0)
    }, 10000)

    test('a tag of a specific user is deleted if a valid token of their own is sent is sent', async () => {
      const initialUser2Tags = tags.filter(bug => bug.user.toString() === users[1].id)

      await api
        .delete(`/api/tags/${tags[1].id}`)
        .set(user2Headers)
        .expect(204)

      const finalUser2Tags = await Tag.find({ user: new ObjectId(users[1].id) })
      expect(finalUser2Tags).toHaveLength(initialUser2Tags.length - 1)
      expect(finalUser2Tags.map(tag => tag.title)).not.toContain(tags[1].title)

      const finalUser2 = await User.findById(users[1].id)
      expect(finalUser2.tags).toHaveLength(initialUser2Tags.length - 1)
      expect(finalUser2.tags).not.toContainEqual(new ObjectId(tags[1].id))
    }, 10000)
  })

  describe('PUT /api/tags - testing updating tags', () => {
    test('a tag of a specific user is updated if valid new data and a valid token are sent', async () => {
      const newBug = {
        title: 'RAM is corrupted',
        description: 'no description'
      }

      const bugResponse = await api
        .post('/api/bugs')
        .send(newBug)
        .set(user1Headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const postedBugId = bugResponse.body.id

      const updatedTag = {
        ...initialTags[0],
        title: 'RAM',
        bugs: [postedBugId]
      }

      const response = await api
        .put(`/api/tags/${tags[0].id}`)
        .send(updatedTag)
        .set(user1Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toBe(updatedTag.title)
      expect(response.body.bugs).toContainEqual(postedBugId)

      const postedBug = await Bug.findById(postedBugId)
      expect(postedBug.tags).toContainEqual(new ObjectId(response.body.id))

      const finalUser1Tags = await Tag.find({ user: new ObjectId(users[0].id) })
      expect(finalUser1Tags.map(tag => tag.title)).toContainEqual(updatedTag.title)
    }, 10000)
  })

})

afterAll(async () => {
  mongoose.connection.close()
})