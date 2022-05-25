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

    let validUser = {
      username: 'binong',
      password: 'correctPassword'
    }
    let loginResponse = await api.post('/api/login').send(validUser)
    const { token } = loginResponse.body
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogs.map((n) => n.title)
    expect(titles).toContain('Me, a former physicist, just launched my first project using Elixir and Phoenix.')
  })

  test('addition of new blog without token returns status code 401', async () => {
    const newBlog = {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length)

    const titles = blogs.map((n) => n.title)
    expect(titles).not.toContain('Me, a former physicist, just launched my first project using Elixir and Phoenix.')
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

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const blogTitles = blogsAtEnd.map((blog) => blog.title)

    expect(blogTitles).not.toContain(blogToDelete.title)
  })
})

describe('updating a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    blogToUpdate.likes = 2022

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate).expect(200)

    const allBlogs = await helper.blogsInDb()
    const updatedBlog = allBlogs.find((blog) => blog.id === blogToUpdate.id)
    expect(updatedBlog.likes).toBe(2022)
  })

  test('fails with status code 404 if id does not exist', async () => {
    const blogId = '5193ec66d6gzbe9360f71c41'
    await api.put(`/api/blogs/${blogId}`).send({ likes: 5 }).expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
})