const loginController = require('../controllers/login')
const loginRouter = require('express').Router()

/**
 * @swagger
 * /api/login:
 *  post:
 *    tags:
 *      - Login
 *    summary: Login a user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                required: true
 *                type: string
 *                format: email
 *                example: testuser@gmail.com
 *              password:
 *                required: true
 *                type: string
 *                minLength: 6
 *                example: password
 *    responses:
 *      200:
 *        description: The user logged in successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: a jwt token
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *                id:
 *                  type: string
 *                  description: the user id
 *                  example: 507f191e810c19729de860ea
 *      401:
 *        description: The user did not login successfully due to invalid credentials
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: the error that caused the user not to login successfully
 *                  example: token missing
 */
loginRouter.post('/', loginController.login)

module.exports = loginRouter