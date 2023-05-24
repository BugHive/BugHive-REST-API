const usersController = require('../controllers/users')
const usersRouter = require('express').Router()
const { tokenExtractor, userExtractor } = require('../utils/middleware')


/**
 * @swagger
 * /api/users:
 *  post:
 *    tags:
 *      - Users
 *    summary: Create a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                required: true
 *                type: string
 *                example: newuser
 *              email:
 *                required: true
 *                type: string
 *                format: email
 *                example: newuser@example.com
 *              password:
 *                required: true
 *                type: string
 *                minLength: 6
 *                example: P@$$$w0rd
 *    responses:
 *      201:
 *        description: Created. The user was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the created user auto generated id
 *                  example: 507f191e810c19729de860ea
 *                username:
 *                  type: string
 *                  description: the username of the created user
 *                  example: testuser
 *                email:
 *                  type: string
 *                  format: email
 *                  description: the email of the created user
 *                  example: testuser@example.com
 *                bugs:
 *                  type: array
 *                  description: the bugs' ids of the created user
 *                  example: []
 *                  items:
 *                    type: string
 *                tags:
 *                  type: array
 *                  description: the tags' ids of the created user
 *                  example: []
 *                  items:
 *                    type: string
 *      400:
 *        description: Bad request. The user wasn't created due to bad sent data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: the error that caused not to create the user
 *                  example: password must be at least 6 characters long
 */
usersRouter.post('/', usersController.addUser)

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Returns a list of all the registered users
 *     responses:
 *       '200':
 *         description: OK. The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: the id of the user
 *                    example: 507f191e810c19729de860ea
 *                  username:
 *                    type: string
 *                    description: the username of the user
 *                    example: testuser
 *                  email:
 *                    type: string
 *                    format: email
 *                    description: the email of the user
 *                    example: testuser@example.com
 *                  darkMode:
 *                    type: boolean
 *                    example: true
 *                  bugs:
 *                    type: array
 *                    description: the bugs of the user
 *                    example: [{
 *                                "title": "Stack Under flow",
 *                                "description": "this bug is very easy to solve",
 *                                "references": [
 *                                    "www.stackoverflow.com",
 *                                    "www.google.com"
 *                                ],
 *                                "tags": [
 *                                    "64695bff7c99ea4a7b947ce7"
 *                                ],
 *                                "id": "646950cd86dd1a50c450bc28"
 *                            }]
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        title:
 *                          type: string
 *                        description:
 *                          type: string
 *                        references:
 *                          type: array
 *                          items:
 *                            type: string
 *                        tags:
 *                          type: array
 *                          description: the tags' ids of the bug
 *                          items:
 *                            type: string
 *                  tags:
 *                    type: array
 *                    description: the tags of the user
 *                    example: [{
 *                                "title": "Memory",
 *                                 "bugs": [
 *                                          "646950cd86dd1a50c450bc28"
 *                                 ],
 *                                "id": "64695bff7c99ea4a7b947ce7"
 *                             }]
 *                    items:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: string
 *                        title:
 *                          type: string
 *                        bugs:
 *                          type: array
 *                          description: the bugs' ids of the tag
 *                          items:
 *                            type: string
 */
usersRouter.get('/', usersController.getAllUsers)

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *  parameters:
 *    userIdParam:
 *      in: path
 *      name: id
 *      description: uniuqe id of the user
 *      required: true
 *      schema:
 *        type: string
 *      example: 64694e8edd83e254bd178da3
 *  responses:
 *    UserNotFoundError:
 *      description: A user with the specified id was not found
 *    UnauthorizedError:
 *      description: Authorization information is missing or invalid
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *                example: 'token missing'
 */

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    tags:
 *      - Users
 *    summary: Get the user by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/userIdParam'
 *    responses:
 *      200:
 *        description: OK. The user's data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the id of the user
 *                  example: 507f191e810c19729de860ea
 *                username:
 *                  type: string
 *                  description: the username of the user
 *                  example: testuser
 *                email:
 *                  type: string
 *                  format: email
 *                  description: the email of the user
 *                  example: testuser@example.com
 *                darkMode:
 *                  type: boolean
 *                  example: true
 *                bugs:
 *                  type: array
 *                  description: the bugs of the user
 *                  example: [{
 *                              "title": "Stack Under flow",
 *                              "description": "this bug is very easy to solve",
 *                              "references": [
 *                                  "www.stackoverflow.com",
 *                                  "www.google.com"
 *                              ],
 *                              "tags": [
 *                                  "64695bff7c99ea4a7b947ce7"
 *                              ],
 *                              "id": "646950cd86dd1a50c450bc28"
 *                          }]
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      description:
 *                        type: string
 *                      references:
 *                        type: array
 *                        items:
 *                          type: string
 *                      tags:
 *                        type: array
 *                        description: the tags' ids of the bug
 *                        items:
 *                          type: string
 *                tags:
 *                  type: array
 *                  description: the tags of the user
 *                  example: [{
 *                              "title": "Memory",
 *                               "bugs": [
 *                                        "646950cd86dd1a50c450bc28"
 *                               ],
 *                              "id": "64695bff7c99ea4a7b947ce7"
 *                           }]
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      title:
 *                        type: string
 *                      bugs:
 *                        type: array
 *                        description: the bugs' ids of the tag
 *                        items:
 *                          type: string
 *      404:
 *        $ref: '#/components/responses/UserNotFoundError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'malformatted id'
 */
usersRouter.get('/:id', tokenExtractor, userExtractor, usersController.getUser)

/**
 * @swagger
 * /api/users/{id}:
 *  delete:
 *    tags:
 *      - Users
 *    summary: Remove the user by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/userIdParam'
 *    responses:
 *      204:
 *        description: No content. The user was deleted successfully
 *      404:
 *        $ref: '#/components/responses/UserNotFoundError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'malformatted id'
 */
usersRouter.delete('/:id', tokenExtractor, userExtractor, usersController.deleteUser)

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    tags:
 *      - Users
 *    summary: Update the user by id
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/userIdParam'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                required: true
 *                type: string
 *                example: updatedUser
 *              email:
 *                required: true
 *                type: string
 *                example: updatedUser@example.com
 *              password:
 *                required: true
 *                type: string
 *                minLength: 6
 *                example: updatedUserP@$$$w0rd
 *              darkMode:
 *                required: true
 *                type: string
 *                example: true
 *              bugs:
 *                required: true
 *                type: array
 *                description: the ids of the bugs of the user.<br/>
 *                             (You may not update user's bugs with this request, just send the old bugs' ids of the user)
 *                items:
 *                  type: string
 *                example: ['646950cd86dd1a50c450bc28']
 *              tags:
 *                required: true
 *                type: array
 *                description: the ids of the tags of the user.<br/>
 *                             (You may not update user's tags with this request, just send the old tags' ids of the user)
 *                items:
 *                  type: string
 *                  example: ['64695bff7c99ea4a7b947ce7']
 *    responses:
 *      200:
 *        description: OK. The user was updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  example: 64694e8edd83e254bd178da3
 *                username:
 *                  type: string
 *                  example: updatedUser
 *                email:
 *                  type: string
 *                  example: updatedUser@example.com
 *                password:
 *                  type: string
 *                  example: updatedUserP@$$$w0rd
 *                darkMode:
 *                  type: string
 *                  example: true
 *                bugs:
 *                  type: array
 *                  items:
 *                    type: string
 *                  example: ['646950cd86dd1a50c450bc28']
 *                tags:
 *                  type: array
 *                  items:
 *                    type: string
 *                    example: ['64695bff7c99ea4a7b947ce7']
 *      404:
 *        $ref: '#/components/responses/UserNotFoundError'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: 'A bug is not a valid bug id'
 */
usersRouter.put('/:id', tokenExtractor, userExtractor, usersController.updateUser)

module.exports = usersRouter