/* eslint-disable no-unused-vars */
var _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.map(blog => blog.likes).reduce((acc, current) => acc + current, 0)
}

const favoriteBlog = blogs => {
  const likesArr = blogs.map(blog => blog.likes)
  const highestLikes = Math.max(...likesArr)
  const favBlog = blogs.filter(blog => blog.likes === highestLikes)[0]
  const title = favBlog.title
  const author = favBlog.author
  const likes = favBlog.likes
  return {
    title,
    author,
    likes
  }
}

const mostBlogs = blogs => {
  const numberOfBlogsPerAuthor = _.countBy(blogs, 'author')
  const authorsArr = Object.entries(numberOfBlogsPerAuthor).map(elem => ({ author: elem[0], blogs: elem[1] }))
  const sortedArrOfAuthors = authorsArr.sort((a, b) => b.blogs - a.blogs)
  return sortedArrOfAuthors[0]
}

const getLikesByAuthor = (authors) => {
  let totalLikesOfSingleAuthor = 0
  authors.forEach(author => {
    totalLikesOfSingleAuthor += author.likes
  })
  return totalLikesOfSingleAuthor
}

const mostLikes = blogs => {
  const groupByAuthor = _.groupBy(blogs, 'author')
  const authorsArr = Object.entries(groupByAuthor).map(elem => ({ author: elem[0], likes: getLikesByAuthor(elem[1]) }))
  const sortedArrOfAuthors = authorsArr.sort((a, b) => b.likes - a.likes)
  return sortedArrOfAuthors[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}