const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const cors = require('cors')
const middleware = require('./utils/middleware')

const loginController = require('./controllers/login')
const usersController = require('./controllers/users')
const bugsController = require('./controllers/bugs')

// express app creation
const app = express()

// db connection
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

// middleware functions
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)


// middleware routes
app.use('/api/login', loginController)
app.use('/api/users', usersController)
app.use('/api/bugs', middleware.tokenExtractor, middleware.userExtractor, bugsController)


// middleware error handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
