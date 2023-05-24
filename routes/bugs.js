const bugsController = require('../controllers/bugs')
const bugsRouter = require('express').Router()


/**
 * @swagger
 * components:
 *  parameters:
 *    bugIdParam:
 *      in: path
 *      name: id
 *      description: uniuqe id of the bug
 *      required: true
 *      schema:
 *        type: string
 *      example: 646950cd86dd1a50c450bc28
 *  responses:
 *    BugNotFoundError:
 *      description: A bug with the specified id was not found
 */

/**
 * @swagger
 * /api/bugs:
 *  post:
 *    tags:
 *      - Bugs
 *    summary: Create a new bug of the logged in user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                required: true
 *                type: string
 *                example: NullPointerException
 *              description:
 *                type: string
 *                example: This bug is very common in Java
 *              lastModifeid:
 *                type: string
 *                format: date-time
 *                description: the date-time notation as defined by RFC 3339
 *                example: 2017-07-21T17:32:28Z
 *              references:
 *                type: array
 *                items:
 *                  type: string
 *                example: ['www.stackoverflow.com']
 *              tags:
 *                type: array
 *                items:
 *                  type: string
 *                description: the ids' of the tags of the bug
 *                example: ['64695bff7c99ea4a7b947ce7']
 *    responses:
 *      201:
 *        description: Created. The bug was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the created bug auto generated id
 *                  example: 646d16397ab3e2a08ed132ae
 *                title:
 *                  type: string
 *                  description: the title of the created bug
 *                  example: NullPointerException
 *                description:
 *                  type: string
 *                  description: the description of the created user
 *                  example: This bug is very common in Java
 *                lastModifeid:
 *                  type: string
 *                  format: date-time
 *                  description: the date-time notation as defined by RFC 3339
 *                  example: 2017-07-21T17:32:28Z
 *                references:
 *                  type: array
 *                  description: the references ids of the created bug
 *                  example: ['www.stackoverflow.com']
 *                  items:
 *                    type: string
 *                tags:
 *                  type: array
 *                  description: the tags' ids of the created bug
 *                  example: ['64695bff7c99ea4a7b947ce7']
 *                  items:
 *                    type: string
 *                user:
 *                  type: string
 *                  description: the id of the logged in user (who created the bug)
 *                  example: 64694e8edd83e254bd178da3
 *      400:
 *        description: Bad request. The bug wasn't created due to bad sent data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: the error that caused not to create the bug
 *                  example: 'Bug validation failed: title: Path `title` is required.'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
bugsRouter.post('/', bugsController.addBug)

/**
 * @swagger
 * /api/bugs:
 *  get:
 *    tags:
 *      - Bugs
 *    summary: Returns a list of all the bugs of the logged in user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK. The list of the bugs
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: the id of the bug
 *                   example: 646d3264a5ddcd8be024746f
 *                 title:
 *                   type: string
 *                   description: the title of the bug
 *                   example: NullPointerException
 *                 description:
 *                   type: string
 *                   description: the description of the bug
 *                   example: This bug is very common in Java
 *                 lastModifeid:
 *                   type: string
 *                   format: date-time
 *                   example: 2017-07-21T17:32:28.000Z
 *                 references:
 *                   type: array
 *                   description: the references of the bug
 *                   example: ['www.stackoverflow.com', 'www.google.com']
 *                   items:
 *                     type: string
 *                 tags:
 *                   type: array
 *                   description: the tags of the bug
 *                   example: [{
 *                             "title": "Java",
 *                            }]
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                 user:
 *                   type: string
 *                   description: the id of the user
 *                   example: 646d36b9b54b23810a995e35
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
bugsRouter.get('/', bugsController.getAllBugs)

/**
 * @swagger
 * /api/bugs/{id}:
 *  get:
 *    tags:
 *      - Bugs
 *    summary: Get a bug by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/bugIdParam'
 *    responses:
 *      200:
 *        description: OK. The bug's data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the id of the bug
 *                  example: 646d3264a5ddcd8be024746f
 *                title:
 *                  type: string
 *                  description: the title of the bug
 *                  example: NullPointerException
 *                description:
 *                  type: string
 *                  format: email
 *                  description: the description of the bug
 *                  example: testuser@example.com
 *                lastModifeid:
 *                  type: string
 *                  format: date-time
 *                  example: 2017-07-21T17:32:28.000Z
 *                references:
 *                  type: array
 *                  description: the references of the bug
 *                  example: ['www.stackoverflow.com', 'www.google.com']
 *                  items:
 *                    type: string
 *                tags:
 *                  type: array
 *                  description: the tags of the bug
 *                  example: [{
 *                            "title": "Java",
 *                           }]
 *                  items:
 *                    type: object
 *                    properties:
 *                      title:
 *                        type: string
 *                user:
 *                  type: string
 *                  description: the id of the user
 *                  example: 646d36b9b54b23810a995e35
 *      404:
 *        $ref: '#/components/responses/BugNotFoundError'
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
bugsRouter.get('/:id', bugsController.getBug)

/**
 * @swagger
 * /api/bugs/:
 *  delete:
 *    tags:
 *      - Bugs
 *    summary: Remove all the bugs of the logged in user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      204:
 *        description: No content. All bugs of the logged in were deleted successfully
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
bugsRouter.delete('/', bugsController.deleteAllBugs)

/**
 * @swagger
 * /api/bugs/{id}:
 *  delete:
 *    tags:
 *      - Bugs
 *    summary: Remove the bug by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/bugIdParam'
 *    responses:
 *      204:
 *        description: No content. All bugs of the logged in were deleted successfully
 *      404:
 *        $ref: '#/components/responses/BugNotFoundError'
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
bugsRouter.delete('/:id', bugsController.deleteBug)

/**
 * @swagger
 * /api/bugs/{id}:
 *  put:
 *    tags:
 *      - Bugs
 *    summary: Update the bug by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/bugIdParam'
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                required: true
 *                type: string
 *                example: ArrayOutOfBoundsException
 *              description:
 *                required: true
 *                type: string
 *                example: This bug happens in Java also
 *              lastModifeid:
 *                required: true
 *                type: string
 *                format: date-time
 *                example: 2023-05-23T23:08:16.073Z
 *              references:
 *                required: true
 *                type: array
 *                example: ['www.stackexchange.com', 'www.stackoverflow.com']
 *              tags:
 *                required: true
 *                type: array
 *                description: the ids' of the tags of the bug
 *                items:
 *                  type: string
 *                example: ['64695bff7c99ea4a7b947ce7']
 *    responses:
 *      200:
 *        description: OK. The bug was updated successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  example: 64694e8edd83e254bd178da3
 *                title:
 *                  type: string
 *                  example: ArrayOutOfBoundsException
 *                description:
 *                  type: string
 *                  example: This bug happens in Java also
 *                lastModifeid:
 *                  type: string
 *                  format: date-time
 *                  example: 2023-05-23T23:08:16.073Z
 *                references:
 *                  type: array
 *                  example: ['www.stackexchange.com', 'www.stackoverflow.com']
 *                tags:
 *                  type: array
 *                  description: the ids' of the tags of the bug
 *                  items:
 *                    type: string
 *                  example: ['64695bff7c99ea4a7b947ce7']
 *                user:
 *                  type: string
 *                  example: 64694e8edd83e254bd178da3
 *      404:
 *        $ref: '#/components/responses/BugNotFoundError'
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
 *                    example: 'A tag is not a valid tag id'
 */
bugsRouter.put('/:id', bugsController.updateBug)

module.exports = bugsRouter