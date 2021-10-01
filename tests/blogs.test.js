const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const emptyBlog = []
  const singleBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: 'Understanding how API routes work in Next.js',
      author: 'Cody Jarrett',
      url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
      likes: 4,
      id: '615660262a7e61df5c26aa7a'
    },
    {
      title: 'Website Setup Essentials',
      author: 'PRIM4T',
      url: 'https://dev.to/prim4t/website-setup-essentials-447o',
      likes: 3,
      id: '615660e52a7e61df5c26aa7d'
    },
    {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2,
      id: '61566b60513e77de4f4b665b'
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(singleBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(14)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: 'Understanding how API routes work in Next.js',
      author: 'Cody Jarrett',
      url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
      likes: 4,
      id: '615660262a7e61df5c26aa7a'
    },
    {
      title: 'Website Setup Essentials',
      author: 'PRIM4T',
      url: 'https://dev.to/prim4t/website-setup-essentials-447o',
      likes: 3,
      id: '615660e52a7e61df5c26aa7d'
    },
    {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2,
      id: '61566b60513e77de4f4b665b'
    }
  ]

  test('blog with highest likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })
})

describe('most blogs', () => {
  const singleBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: 'Understanding how API routes work in Next.js',
      author: 'Cody Jarrett',
      url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
      likes: 4,
      id: '615660262a7e61df5c26aa7a'
    },
    {
      title: 'Website Setup Essentials',
      author: 'PRIM4T',
      url: 'https://dev.to/prim4t/website-setup-essentials-447o',
      likes: 3,
      id: '615660e52a7e61df5c26aa7d'
    },
    {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2,
      id: '61566b60513e77de4f4b665b'
    }
  ]

  test('list with only one blog', () => {
    const result = listHelper.mostBlogs(singleBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    })
  })

  test('list with duplicated author', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      blogs: 2,
    })
  })
})

describe('most likes', () => {
  const singleBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
  const blogs = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: 'Understanding how API routes work in Next.js',
      author: 'Cody Jarrett',
      url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
      likes: 4,
      id: '615660262a7e61df5c26aa7a'
    },
    {
      title: 'Website Setup Essentials',
      author: 'PRIM4T',
      url: 'https://dev.to/prim4t/website-setup-essentials-447o',
      likes: 3,
      id: '615660e52a7e61df5c26aa7d'
    },
    {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2,
      id: '61566b60513e77de4f4b665b'
    }
  ]
  const singleBlogWithHighestLikes = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      title: 'Understanding how API routes work in Next.js',
      author: 'Cody Jarrett',
      url: 'https://dev.to/codymjarrett/understanding-how-api-routes-work-in-next-js-50fm',
      likes: 12,
      id: '615660262a7e61df5c26aa7a'
    },
    {
      title: 'Website Setup Essentials',
      author: 'PRIM4T',
      url: 'https://dev.to/prim4t/website-setup-essentials-447o',
      likes: 3,
      id: '615660e52a7e61df5c26aa7d'
    },
    {
      title: 'Me, a former physicist, just launched my first project using Elixir and Phoenix.',
      author: 'Felipe Lincoln',
      url: 'https://dev.to/felipelincoln/me-a-former-physicist-just-launched-my-first-project-using-elixir-and-phoenix-8k',
      likes: 2,
      id: '61566b60513e77de4f4b665b'
    }
  ]

  test('list with only one blog', () => {
    const result = listHelper.mostLikes(singleBlog)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 5,
    })
  })

  test('list with multiple blogs of certain author', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 10,
    })
  })

  test('list with single blog that has many likes', () => {
    const result = listHelper.mostLikes(singleBlogWithHighestLikes)
    expect(result).toEqual({
      author: 'Cody Jarrett',
      likes: 12,
    })
  })
})