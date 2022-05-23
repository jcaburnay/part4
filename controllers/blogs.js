const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Missing or invalid token provided' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'Missing or invalid token provided' })
  }
  const blogToBeDeleted = await Blog.findById(id)
  const idFromDecodedToken = decodedToken.id
  const idFromBlog = blogToBeDeleted.user.toString()
  if(idFromDecodedToken !== idFromBlog) {
    return response.status(401).json({ error: 'Unauthorized to perform delete action' })
  }
  await Blog.findByIdAndRemove(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const blogId = request.params.id
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(blogId, blog, { new: true, runValidators: true })

  if(!updatedBlog){
    return response.status(404).send({ error: 'Blog does not exist' })
  }

  response.json(updatedBlog)
})

module.exports = blogsRouter