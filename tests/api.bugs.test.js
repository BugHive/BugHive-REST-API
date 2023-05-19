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

const initialBugs = [
  {
    title: 'Stack Over flow Error',
    description: 'This error is caused when the stack is filled',
    references: ['www.stackoverflow.com', 'www.google.com'],
    user: null
  },
  {
    title: 'Array Out of Bounds',
    description: 'This error happens in type safe languages like java',
    references: ['www.stackoverflow.com', 'www.facebook.com'],
    user: null
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
  initialBugs[0].user = new ObjectId(response1.body.id)

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
  initialBugs[1].user = new ObjectId(response2.body.id)


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
 * test /api/bugs endpoints
 */
describe('testing /api/bugs different endpoints', () => {
  let users = null
  let bugs = null

  beforeEach(async () => {
    await Bug.deleteMany({})
    await Tag.deleteMany({})
    await Bug.insertMany(initialBugs)

    bugs = await Bug.find({})
    users = await User.find({})
    await User.findByIdAndUpdate(users[0].id, { ...user1, bugs: [new ObjectId(bugs[0].id)] })
    await User.findByIdAndUpdate(users[1].id, { ...user2, bugs: [new ObjectId(bugs[1].id)] })

  }, 10000)

  describe('POST /api/bugs - testing adding new bugs', () => {
    test('a valid bug with logged in user is added', async () => {
      const bugData = {
        title: 'Segmentation fault',
        description: 'This bug happens in c langauge due to ...',
        references: ['www.google.com']
      }

      const response = await api
        .post('/api/bugs')
        .send(bugData)
        .set(user1Headers)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const finalBugs = await Bug.find({})
      expect(finalBugs).toHaveLength(initialBugs.length + 1)

      const bugTitles = finalBugs.map(bug => bug.title)
      expect(bugTitles).toContain(bugData.title)

      expect(response.body.user).toEqual(users[0].id)

      const posterUser = await User.findById(users[0].id)
      expect(posterUser.bugs).toContainEqual(new ObjectId(response.body.id))

    }, 10000)

    test('a valid bug with invalid jwt token in not added', async () => {
      const bugData = {
        title: 'Segmentation fault',
        description: 'This bug happens in c langauge due to ...',
        references: ['www.google.com']
      }

      await api
        .post('/api/bugs')
        .send(bugData)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const finalBugs = await Bug.find({})
      expect(finalBugs).toHaveLength(initialBugs.length)
    }, 10000)
  })

  describe('GET /api/bugs - testing getting bugs', () => {
    test('all bugs of a specific user with a valid token are returned as json', async () => {

      const response = await api
        .get('/api/bugs')
        .set(user2Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(users[1].bugs.length)
    }, 10000)

    test('a bug of a specific user is returned if a valid token is sent', async () => {

      const response = await api
        .get(`/api/bugs/${bugs[1].id}`)
        .set(user2Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toEqual(bugs[1].title)
      expect(response.body.user).toEqual(users[1].id)

    }, 10000)

    test('a bug of a specific user can only be viewed by them', async () => {

      const response = await api
        .get(`/api/bugs/${bugs[0].id}`)
        .set(user2Headers)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      expect(response.body.error).toEqual('a user can only view their bugs')
    }, 10000)
  })

  describe('DELETE /api/bugs - testing deleting bugs', () => {
    test('all bugs of a specific user are deleted if a valid token is sent', async () => {
      await api
        .delete('/api/bugs')
        .set(user1Headers)
        .expect(204)

      const finalUser1Bugs = await Bug.find({ user: new ObjectId(users[0].id) })
      expect(finalUser1Bugs).toHaveLength(0)

      const finalUser1 = await User.findById(users[0].id)
      expect(finalUser1.bugs).toHaveLength(0)
    }, 10000)

    test('a bug of a specific user is deleted if a valid token is sent', async () => {
      const initialUser2Bugs = bugs.filter(bug => bug.user.toString() === users[1].id)

      await api
        .delete(`/api/bugs/${bugs[1].id}`)
        .set(user2Headers)
        .expect(204)

      const finalUser2Bugs = await Bug.find({ user: new ObjectId(users[1].id) })
      expect(finalUser2Bugs).toHaveLength(initialUser2Bugs.length - 1)

      const finalUser2 = await User.findById(users[1].id)
      expect(finalUser2.bugs).toHaveLength(initialUser2Bugs.length - 1)
    }, 10000)
  })

  describe('PUT /api/bugs - testing updating bugs', () => {
    test('a bug of a specific user is updated if valid new data and a valid token are sent', async () => {
      const updatedBug = {
        ...initialBugs[0],
        title: 'Stack Under flow Error',
      }

      const response = await api
        .put(`/api/bugs/${bugs[0].id}`)
        .send(updatedBug)
        .set(user1Headers)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(response.body.title).toBe(updatedBug.title)

      const finalUser1Bugs = await Bug.find({ user: new ObjectId(users[0].id) })
      const bugTitles = finalUser1Bugs.map(bug => bug.title)
      expect(bugTitles).toContain(updatedBug.title)

    }, 10000)

  })
})


afterAll(async () => {
  mongoose.connection.close()
})