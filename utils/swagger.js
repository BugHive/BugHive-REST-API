const swaggerJsDoc = require('swagger-jsdoc')


const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BugHive REST-API',
      version: '1.0.0',
      description: 'A simple rest api backend for BugHive chrome extension.'
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local dev server'
      },
      {
        url: 'https://bughive-rest-api.onrender.com',
        description: 'Production server'
      }
    ],
  },
  apis: ['./routes/*.js']
}

const spec = swaggerJsDoc(options)

module.exports = spec