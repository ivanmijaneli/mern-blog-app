const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const blogController = require('../controllers/blogController')

// get all blogs
blogsRouter.get('/', middleware.verifyToken, blogController.blogs_get)

// post blog
blogsRouter.post('/', middleware.verifyToken, blogController.blog_post)

// delete blog
blogsRouter.delete('/:id', middleware.verifyToken, blogController.blog_delete)

// like blog
// we only use PUT for liking a blog
blogsRouter.put('/:id', middleware.verifyToken, blogController.blog_like)

// comment blog
blogsRouter.post('/:id/comments', middleware.verifyToken, blogController.blog_comment)

module.exports = blogsRouter