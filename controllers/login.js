const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const login =  async (request, response) => {
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

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: process.env.JWT_PEROID })

  response.status(200).send({ token, id: user.id })
}

module.exports = {
  login
}