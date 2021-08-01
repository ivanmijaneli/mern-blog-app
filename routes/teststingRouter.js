const testingRouter = require('express').Router()
const User = require('../models/User')
const Blog = require('../models/Blog')
const RefreshToken = require('../models/RefreshToken')

testingRouter.post('/reset', async (request, response) => {
    await User.deleteMany({})
    await RefreshToken.deleteMany({})
    await Blog.deleteMany({})

    response.status(204).end()
})

module.exports = testingRouter