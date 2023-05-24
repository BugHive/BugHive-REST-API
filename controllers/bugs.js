const { ObjectId } = require('mongodb')
const Bug = require('../models/bug')
const Tag = require('../models/tag')
const { isValidObjectId } = require('../utils/helper')



const addBug = async (request, response) => {
  const body = request.body
  const user = request.user

  // validating the new tags
  if(body.tags) {
    for(let tag of body.tags) {
      const validObjectId = await isValidObjectId(tag, Tag, user)
      if(!validObjectId) {
        return response.status(400).json({ error: 'A tag is not a valid tag id' })
      }
      tag = new ObjectId(tag)
    }
  }


  const bug = new Bug({
    title: body.title,
    description: body.description,
    lastModifeid: body.lastModifeid,
    references: body.references,
    user: new ObjectId(user.id),
    tags: body.tags || []
  })
  const savedBug = await bug.save()

  user.bugs = user.bugs.concat(new ObjectId(savedBug.id))
  await user.save()

  for (let tagId of bug.tags) {
    const tag = await Tag.findById(tagId.toString())
    tag.bugs = tag.bugs.concat(new ObjectId(savedBug.id))
    await tag.save()
  }

  response.status(201).json(savedBug)
}

const getAllBugs =  async (request, response) => {
  const user = request.user

  const bugs = await Bug
    .find({ user: new ObjectId(user.id) })
    .populate('tags', { title: 1 })

  response.json(bugs)
}

const getBug =  async (request, response) => {
  const user = request.user

  const bug = await Bug
    .findById(request.params.id)
    .populate('tags', { title: 1 })

  if (!bug) {
    return response.status(404).end()
  }

  if (bug.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only view their bugs' })
  }

  response.json(bug)
}

const deleteAllBugs =  async (request, response) => {
  const user = request.user

  await Bug.deleteMany({ user: new ObjectId(user.id) })

  user.bugs = []
  await user.save()

  const tags = await Tag.find({ user: new ObjectId(user.id) })
  for (let tag of tags) {
    tag.bugs = []
    await tag.save()
  }

  response.status(204).end()
}


const deleteBug =  async (request, response) => {
  const user = request.user
  const bug = await Bug.findById(request.params.id)

  if (!bug) {
    return response.status(404).end()
  }
  if (bug.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only delete their bugs' })
  }

  await Bug.findByIdAndRemove(request.params.id)

  // remove the bug from user's bugs
  user.bugs = user.bugs.filter(bug => bug.toString() !== request.params.id)
  await user.save()

  // remove the bug from user's tags
  const bugTags = await Tag.find({ user: new ObjectId(user.id) }, { bugs: new ObjectId(bug.id) } )

  for (let bugTag of bugTags) {
    bugTag.bugs = bugTag.bugs.filter(bug => bug.toString() !== bug.id)
    await bugTag.save()
  }

  response.status(204).end()
}

const updateBug =  async (request, response) => {
  const body = request.body
  const user = request.user

  const bug = await Bug.findById(request.params.id)

  if (!bug) {
    return response.status(404).end()
  }

  if (bug.user.toString() !== user.id) {
    return response.status(401).json({ error: 'a user can only update their bugs' })
  }

  // validating the new tags
  if(body.tags) {
    for(let tag of body.tags) {
      const validObjectId = await isValidObjectId(tag, Tag, user)
      if(!validObjectId) {
        return response.status(400).json({ error: 'A tag is not a valid tag id' })
      }
      tag = new ObjectId(tag)
    }
  }

  const bugOldTags = await Tag.find({ user: new ObjectId(user.id) }, { bugs: new ObjectId(bug.id) })

  bug.title = body.title
  bug.description = body.description
  bug.lastModifeid = body.lastModifeid
  bug.references = body.references
  bug.tags = body.tags || []
  await bug.save()

  for(let tag of bugOldTags) {
    tag.bugs = tag.bugs.filter(bug => bug.toString() !== bug.id)
  }

  const bugNewTags = bug.tags
  for(let tagId of bugNewTags) {
    const tag = await Tag.findById(tagId.toString())
    tag.bugs = tag.bugs.concat(new ObjectId(bug.id))
    await tag.save()
  }

  response.json(bug)
}


module.exports = {
  addBug,
  getAllBugs,
  getBug,
  deleteAllBugs,
  deleteBug,
  updateBug
}