const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
  {
    username: 'joe',
    email: 'joe@gmail.com',
    passwordHash: '$2b$10$dli7RL9hL4MKlIaEsXe7IOhtknET1bC1.THhyRvsTwt7Wb1WFcIza' // => '123456'
  },
  {
    username: 'bob',
    email: 'bob@gmail.com',
    passwordHash: '$2b$10$/zF2ftnmk0ck9n0ayhNbse2y376eMzlWpic44.GDSgPvxHGLFb93u' // => 'qwerty'
  }
]

/**
 * test /api/login endpoints
 */
describe('testing /api/login endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
  }, 20000)

  test('a user with valid credentials can login', async () => {
    await api
      .post('/api/login')
      .send({ email: 'joe@gmail.com', password: '123456' })
      .expect(200)

  }, 10000)

  test('a user with invalid credentials cannot login', async () => {
    await api
      .post('/api/login')
      .send({ email: 'doe@gmail.com', password: 'hacked' })
      .expect(401)

  }, 10000)
})

afterAll(async () => {
  await mongoose.connection.close()
})
