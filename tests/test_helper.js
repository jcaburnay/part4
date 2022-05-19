const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Understanding how API routes work in Next.js',
    author: 'Cody Jarrett',
    url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
    likes: 4
  },
  {
    title: 'Website Setup Essentials',
    author: 'PRIM4T',
    url: 'https://dev.to/prim4t/website-setup-essentials-447o',
    likes: 3
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon', date: new Date() })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}