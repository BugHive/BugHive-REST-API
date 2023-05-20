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
 * test /api/users endpoints
 */
describe('testing /api/users different endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
  }, 20000)

  describe('testing endpoints without authentication', () => {
    describe('POST /api/users - testing adding new users', () => {
      test('a user with vaild data is added', async () => {
        const newUser = {
          username: 'sara',
          email: 'sara@gmail.com',
          password: 'password'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/)


        const finalUsers = await User.find({})
        expect(finalUsers).toHaveLength(initialUsers.length + 1)

        const usernames = finalUsers.map(user => user.username)
        expect(usernames).toContain(newUser.username)
      }, 10000)

      test('a user with short password is not added', async () => {
        const newUser = {
          username: 'ali',
          email: 'ali@gmail.com',
          password: '123'
        }

        const response = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        expect(response.body.error).toEqual('password must be at least 6 characters long')

        const finalUsers = await User.find({})
        expect(finalUsers).toHaveLength(initialUsers.length)
      }, 10000)

      test('a user with an existing email address is not added', async () => {
        const newUser = {
          username: 'sam',
          email: 'bob@gmail.com',
          password: '123456'
        }

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)

        const finalUsers = await User.find({})
        expect(finalUsers).toHaveLength(initialUsers.length)
      }, 10000)
    })

    describe('GET /api/users - testing getting all users', () => {
      test('all users are returned as json', async () => {
        const response = await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialUsers.length)
      }, 10000)
    })

  })


  describe('testing endpoints that require authentication', () => {
    let headers = null
    let testUserId = null
    const testUser = {
      username: 'test',
      email: 'test@gmail.com',
      password: 'password'
    }

    beforeEach(async () => {
      const registerResponse = await api
        .post('/api/users')
        .send(testUser)

      testUserId = registerResponse.body.id

      const loginResponse = await api
        .post('/api/login')
        .send(testUser)

      headers = {
        'Authorization': `bearer ${loginResponse.body.token}`
      }
    }, 20000)

    describe('GET /api/users/:id - testing getting a specific user', () => {

      test('a user\'s data is returned if their valid token is sent', async () => {
        const response = await api
          .get(`/api/users/${testUserId}`)
          .set(headers)
          .expect(200)
          .expect('Content-Type', /application\/json/)

        expect(response.body.email).toBe(testUser.email)
        expect(response.body.username).toBe(testUser.username)
      })

      test('a user\'s data is not returned without a valid token', async () => {
        await api
          .get(`/api/users/${testUserId}`)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      })
    }, 10000)

    describe('DELETE /api/users - testing deleting users', () => {

      test('a user can only delete their data with a valid token', async () => {
        await api
          .delete(`/api/users/${testUserId}`)
          .set(headers)
          .expect(204)

        const finalUsers = await User.find({})
        expect(finalUsers).toHaveLength(initialUsers.length)
      }, 10000)
    })


    describe('PUT /api/users - testing updating users', () => {

      test('a user can only update their data with a valid token', async () => {
        const updatedTestUser = {
          username: 'test',
          email: 'test@gmail.com',
          password: 'password',
          darkMode: true,
          bugs: [],
          tags: []
        }

        const response = await api
          .put(`/api/users/${testUserId}`)
          .send(updatedTestUser)
          .set(headers)
          .expect(200)

        expect(response.body.darkMode).toBe(true)
      }, 10000)
    })
  })
})



afterAll(async () => {
  await mongoose.connection.close()
})
