const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is only one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const userObjects = helper.initialUsers.map(user => new User(user))
    const promiseArray = userObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('creation succeeds with a new username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'testPassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('fails with status code 400 if username is invalid', async () => {
    const newUser = {
      username: 'be',
      name: 'Jonathan Caburnay',
      password: 'password123'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })

  test('fails with status code 400 if password is invalid', async () => {
    const newUser = {
      username: 'ben',
      name: 'Jonathan Caburnay',
      password: 'p3'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})