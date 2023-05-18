const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ email: body.email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }

  const userForToken = {
    email: user.email,
    id: user.id
  }

  const toeknValidityDuration = 12 * 60 * 60

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: toeknValidityDuration })

  response.status(200).send({ token })
})

module.exports = loginRouter