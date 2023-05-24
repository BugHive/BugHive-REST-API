const tagsController = require('../controllers/tags')
const tagsRouter = require('express').Router()

/**
 * @swagger
 * components:
 *  parameters:
 *    tagIdParam:
 *      in: path
 *      name: id
 *      description: uniuqe id of the tag
 *      required: true
 *      schema:
 *        type: string
 *      example: 646950cd86dd1a50c450bc28
 *  responses:
 *    TagNotFoundError:
 *      description: A tag with the specified id was not found
 */

/**
 * @swagger
 * /api/tags:
 *  post:
 *    tags:
 *      - Tags
 *    summary: Create a new tag of the logged in user
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
 *                example: Memory
 *              bugs:
 *                type: array
 *                items:
 *                  type: string
 *                description: the ids' of the bugs of the tag
 *                example: ['64695bff7c99ea4a7b947ce7']
 *    responses:
 *      201:
 *        description: Created. The tag was created successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  description: the created tag auto generated id
 *                  example: 646d16397ab3e2a08ed132ae
 *                title:
 *                  type: string
 *                  description: the title of the created tag
 *                  example: Memory
 *                tags:
 *                  type: array
 *                  description: the bugs' ids of the created tag
 *                  example: ['64695bff7c99ea4a7b947ce7']
 *                  items:
 *                    type: string
 *                user:
 *                  type: string
 *                  description: the id of the logged in user (who created the tag)
 *                  example: 64694e8edd83e254bd178da3
 *      400:
 *        description: Bad request. The tag wasn't created due to bad sent data
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: string
 *                  description: the error that caused not to create the tag
 *                  example: 'Bug validation failed: title: Path `title` is required.'
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
tagsRouter.post('/', tagsController.addTag)

/**
 * @swagger
 * /api/tags:
 *  get:
 *    tags:
 *      - Tags
 *    summary: Returns a list of all the tags of the logged in user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: OK. The list of the tags
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: the id of the tag
 *                   example: 646d3264a5ddcd8be024746f
 *                 title:
 *                   type: string
 *                   description: the title of the tag
 *                   example: Memory
 *                 bugs:
 *                   type: array
 *                   description: the bugs of the tag
 *                   example: [{
 *                             "title": "NullPointerException",
 *                             "description": "This bug is very common in Java",
 *                             "lastModifeid": "2017-07-21T17:32:28.000Z",
 *                             "references": ['www.stackoverflow.com', 'www.google.com']
 *                            }]
 *                   items:
 *                     type: object
 *                     properties:
 *                      title:
 *                        type: string
 *                        description:
 *                      lastModifeid:
 *                        type: string
 *                        format: date-time
 *                      references:
 *                        type: array
 *                        items:
 *                          type: string
 *                 user:
 *                   type: string
 *                   description: the id of the user
 *                   example: 646d36b9b54b23810a995e35
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
tagsRouter.get('/', tagsController.getAllTags)

/**
 * @swagger
 * /api/tags/{id}:
 *  get:
 *    tags:
 *      - Tags
 *    summary: Get a tag by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/tagIdParam'
 *    responses:
 *      '200':
 *        description: OK. The tag's data
 *        content:
 *          application/json:
 *            schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: the id of the tag
 *                 example: 646d3264a5ddcd8be024746f
 *               title:
 *                 type: string
 *                 description: the title of the tag
 *                 example: Memory
 *               bugs:
 *                 type: array
 *                 description: the bugs of the tag
 *                 example: [{
 *                           "title": "NullPointerException",
 *                           "description": "This bug is very common in Java",
 *                           "lastModifeid": "2017-07-21T17:32:28.000Z",
 *                           "references": ['www.stackoverflow.com', 'www.google.com']
 *                          }]
 *                 items:
 *                   type: object
 *                   properties:
 *                    title:
 *                      type: string
 *                      description:
 *                    lastModifeid:
 *                      type: string
 *                      format: date-time
 *                    references:
 *                      type: array
 *                      items:
 *                        type: string
 *               user:
 *                 type: string
 *                 description: the id of the user
 *                 example: 646d36b9b54b23810a995e35
 *      404:
 *        $ref: '#/components/responses/TagNotFoundError'
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
tagsRouter.get('/:id', tagsController.getTag)

/**
 * @swagger
 * /api/tags/:
 *  delete:
 *    tags:
 *      - Tags
 *    summary: Remove all the tags of the logged in user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      204:
 *        description: No content. All tags of the logged in were deleted successfully
 *      401:
 *        $ref: '#/components/responses/UnauthorizedError'
 */
tagsRouter.delete('/', tagsController.deleteAllTags)

/**
 * @swagger
 * /api/tags/{id}:
 *  delete:
 *    tags:
 *      - Tags
 *    summary: Remove the tag by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/tagIdParam'
 *    responses:
 *      204:
 *        description: No content. All tags of the logged in were deleted successfully
 *      404:
 *        $ref: '#/components/responses/TagNotFoundError'
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
tagsRouter.delete('/:id', tagsController.deleteTag)

/**
 * @swagger
 * /api/tags/{id}:
 *  put:
 *    tags:
 *      - Tags
 *    summary: Update the tag by id of the logged in user
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - $ref: '#/components/parameters/tagIdParam'
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
 *                example: Random Access Memory
 *              bugs:
 *                required: true
 *                type: array
 *                description: the ids' of the bugs of the tag
 *                items:
 *                  type: string
 *                example: ['64695bff7c99ea4a7b947ce7']
 *    responses:
 *      200:
 *        description: OK. The tag was updated successfully
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
 *                  example: Random Access Memory
 *                bugs:
 *                  type: array
 *                  description: the ids' of the bugs of the tag
 *                  items:
 *                    type: string
 *                  example: ['64695bff7c99ea4a7b947ce7']
 *                user:
 *                  type: string
 *                  example: 64694e8edd83e254bd178da3
 *      404:
 *        $ref: '#/components/responses/TagNotFoundError'
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
tagsRouter.put('/:id', tagsController.updateTag)

module.exports = tagsRouter