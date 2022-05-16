const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
}, 100000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('identifier property is id not _id', async () => {
  const response = await api.get('/api/blogs')
  const result = response.body.map(r => r.id)
  expect(result[0]).toBeDefined()
})

describe('addition of a new blog', () => {
  test('addition of new blog', async () => {
    const newBlog = {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogs.map((n) => n.title)
    expect(titles).toContain('Me, a former physicist, just launched my first project using Elixir and Phoenix.')
  })

  test('no likes property in request', async () => {
    const newBlog = {
      title: 'New Blog - Full Stack Open 2022 Part 4',
      author: 'Jonathan Caburnay',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
    const newlyAddedBlog = blogs.find(blog => blog.title === 'New Blog - Full Stack Open 2022 Part 4')
    expect(newlyAddedBlog.likes).toBe(0)
  })

  // Both title and url properties are not included in the creation of a new blog
  test('fails with status code 400 if both title and url are missing', async () => {
    const newBlog = {
      author: 'Jonathan Caburnay'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogs = await helper.blogsInDb()

    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  // URL property is not included in the creation of a new blog
  test('fails with status code 400 if url property is missing', async () => {
    const newBlog = {
      title: 'Monday Blog - FOS2022',
      author: 'Jonathan Caburnay'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogs = await helper.blogsInDb()

    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  // Title property is not included in the creation of a new blog
  test('fails with status code 400 if title property is missing', async () => {
    const newBlog = {
      author: 'Jonathan Caburnay',
      url: 'https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogs = await helper.blogsInDb()

    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})