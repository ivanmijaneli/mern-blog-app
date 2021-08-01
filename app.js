const express = require('express')
require('express-async-errors')
const app = express()
const usersRouter = require('./routes/userRouter')
const blogsRouter = require('./routes/blogRouter')
const cookieParser = require('cookie-parser')
// const cors = require('cors')
//const helmet = require('helmet')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const path = require('path')
const compression = require('compression')

app.use(compression())

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

logger.info('connecting to', config.MONGODB_URI)
 
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

// no need for cors when proxy is used ?
// app.use(cors())
// app.use(helmet()) - Content-Secuirty-Policy header blocks loading of recourses - learn more about this!
app.use(express.json())
app.use(cookieParser())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./routes/teststingRouter')
    app.use('/api/testing', testingRouter)
}

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app