const Blog = require('../models/Blog')
const User = require('../models/User')

const blogs_get = async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1 })
  response.json(blogs)
}

const blog_post = async (request, response) => {
    const { body, token } = request

    const user = await User.findById(token.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      likedBy: [],
      user: user._id
    })

    const savedBlog = await blog.save()

    savedBlog
      .populate('user', { username: 1 })
      // execute population
      .execPopulate()
    
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
}

const blog_delete = async (request, response) => {
    const { token } = request

    const user = await User.findById(token.id)
    const blog = await Blog.findById(request.params.id)

    if (!blog) throw 'blog not found'

    if (user.id.toString() !== blog.user.toString()) throw 'cannot delete blog'

    // remove blog reference
    await user.updateOne({ $pull: { blogs: request.params.id } })
  
    await blog.remove()
    response.status(204).end()
}

// we only use PUT for liking a blog
const blog_like = async (request, response) => {
    const { userId } = request.body

    const blog = await Blog.findById(request.params.id)

    if (!blog) throw 'blog not found'

    let like
    // like
    if (!blog.likedBy.find(id => id === userId)) {
      like = {
          likes: blog.likes + 1,
          likedBy: [...blog.likedBy, userId]
      }
    // dislike
    } else {
        like = {
            likes: blog.likes - 1,
            likedBy: blog.likedBy.filter(id => id !== userId)
        }
    }
  
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, like, { new: true })
      // do we really need to populate here?
      .populate('user', { username: 1 })

    response.json(updatedBlog)
}

const blog_comment = async (request, response) => {
    const { body } = request
  
    const blog = await Blog.findById(request.params.id)

    if (!blog) throw 'blog not found'
    if (!body.comment) throw 'invalid data'

    const comments = {
      comments: [...blog.comments, body.comment]
    }

    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, comments, { new: true })
      // do we need to populate here?
      .populate('user', { username: 1 })

    response.json(updatedBlog)
}

module.exports = {
    blogs_get,
    blog_post,
    blog_delete,
    blog_like,
    blog_comment
}