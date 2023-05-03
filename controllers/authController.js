/* const uuid = require('uuid')
const db = require('../models')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
const UserModel = require('../models/user.model.js')

module.exports.signup_post = async (req, res) => {
  console.log('Signup controller called.')
  const firstname = req.body.firstname
  const lastname = req.body.lastname
  const email = req.body.email
  const password = bcrypt.hashSync(req.body.password, 8)
  try {
    await UserModel.createUser(firstname, lastname, email, password).then(
      (UserModel) => {
        console.log('Signup succeeded.')
        res.send({ message: 'User registered successfully!' })
      },
    )
  } catch (err) {
    console.log('Signup failed.' + err.message)
    res.status(500).send({ error: err.message })
  }
}
 */
