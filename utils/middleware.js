const jwt = require('jsonwebtoken')

const errorHandler = (error, request, response, next) => {    
    
    if (typeof error === 'string') {
      return response.status(error.toLowerCase().endsWith('not found') ? 404 : 400).json({ error })
    }

    else if (error.name === 'ValidationError') {
      // add all error messagges to error 
      let errors = {}
      Object.values(error.errors).forEach(({ properties }) => errors[properties.path] = properties.message)
      return response.status(400).json({ error: errors })
    } 
    
    else if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ 
        error: 'malformatted id' 
      })
    }
   
    // default to 500 server error
    // instead of passing it to mongoose default error handler with next()
    return response.status(500).json({ message: error.message })
  }

const verifyToken = (request, response, next) => {
  try {
    const token = request.get('authorization').split(' ')[1]

    // verify and add token to request
    request.token = jwt.verify(token, process.env.SECRET)

    next()
  } catch (err) {
    response.status(401).json({ error: 'token invalid or missing' })
  }
}

const unknownEndpoint = (request, response) => {
  return response.status(404).json({ error: 'unknown endpoint' })
}

module.exports = { errorHandler, verifyToken, unknownEndpoint }