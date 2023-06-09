const logger = require('./logger')
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const User = require('../models/user')

morgan.token('post_body', function (request) {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
  return null
})
const requestLogger =  morgan(':method :url :status :res[content-length] - :response-time ms :post_body')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError' && error.message.startsWith('Cast to ObjectId failed')) {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'CastError' || error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }

  next()
}

/**
 * represents jwt validation functionality,
 * it should be use in each route that requires
 * user's authentication.
 */
const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if(!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  request.user = user

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}