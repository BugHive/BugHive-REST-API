const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const express = require('express')
require('express-async-errors')
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./utils/swagger')
const cors = require('cors')
const middleware = require('./utils/middleware')


const loginRouter = require('./routes/login')
const usersRouter = require('./routes/users')
const bugsRouter = require('./routes/bugs')
const tagsRouter = require('./routes/tags')

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

// swagger
app.use('/api-docs', swaggerUI.serve)
app.get('/api-docs', swaggerUI.setup(swaggerSpec))
app.get('/', (request, response) => response.redirect('/api-docs'))

// middleware routes
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/bugs', middleware.tokenExtractor, middleware.userExtractor, bugsRouter)
app.use('/api/tags', middleware.tokenExtractor, middleware.userExtractor, tagsRouter)


// middleware error handlers
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
