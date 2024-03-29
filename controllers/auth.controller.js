const uuid = require('uuid')
const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role

const Op = db.Sequelize.Op
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')

// signup method for register a new member in gym
exports.signup = (req, res) => {
  console.log('Signup controller called.')
  var _id = uuid.v4()
  // Save User to Database
  // verifySignUp middleware would ensure that no same user/email already exists
  User.create({
    id: _id,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    membership: req.body.membership,
  })
    .then((user) => {
      console.log('Signup succeeded.')
      res.send({ message: 'User registered successfully!' })
      console.log(req.body.roles)
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: 'User registered successfully!' })
          })
        })
      } else {
        //   // user role = 1
        user.setRoles([1]).then(() => {
          // res.send({ message: 'User registered successfully!' })
          res.status(200).send({ message: 'User registered successfully!' })
        })
      }
    })
    .catch((err) => {
      console.log('Signup failed.' + err.message)
      res.status(500).send({ error: err.message })
    })
}

// signIn method for login a member or admin of gym
exports.signIn = (req, res) => {
  console.log('SignIn controller called.')
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ error: 'User Not found.' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          error: 'Invalid Password!',
        })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      })

      var authorities = []
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase())
        }
        res.status(200).send({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          roles: authorities,
          accessToken: token,
        })
      })
    })
    .catch((err) => {
      res.status(500).send({ error: err.message })
    })
}
