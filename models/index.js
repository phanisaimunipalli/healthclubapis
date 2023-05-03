const config = require('../config/db.config.js')
const Sequelize = require('sequelize')

// Database connection
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  operatorsAliases: 0,

  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
    define: {
      timestamps: false,
    },
  },
})

// DB Schema
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require('./userModel')(sequelize, Sequelize)
db.role = require('./role.model')(sequelize, Sequelize)
db.gym = require('./gymModel')(sequelize, Sequelize)
db.membership = require('./membership')(sequelize, Sequelize)
db.classSchedule = require('./classSchedule')(sequelize, Sequelize)
db.logTime = require('./logTime')(sequelize, Sequelize)
db.enrollment = require('./enrollment')(sequelize, Sequelize)
db.class = require('./classSchedule')(sequelize, Sequelize)
db.activity = require('./activity')(sequelize, Sequelize)
// association of enrollment with classSchedule model
db.enrollment.belongsTo(db.class, { foreignKey: 'classId' })
db.enrollment.belongsTo(db.user, { foreignKey: 'userId' })

// A user can have many logtime
db.user.hasMany(db.logTime)
db.logTime.belongsTo(db.user)

/* db.file = require('./file.model')(sequelize, Sequelize)
// A user can have multiple files
db.user.hasMany(db.file, {
  foreignKey: 'userId',
})
db.file.belongsTo(db.user) */

// Each role can have multiple users
db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId',
})

// Each user can have multiple roles
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId',
})

// A gym has 2 memberships
db.gym.hasMany(db.membership, {
  foreignKey: 'Id',
})
db.membership.belongsTo(db.gym)
console.log(db.membership)

// A gym has many classes
db.gym.hasMany(db.classSchedule, {
  foreignKey: 'classId',
})
db.classSchedule.belongsTo(db.gym)

db.ROLES = ['user', 'admin']

db.gym.prototype.getMemberships = async function () {
  let memberships = await db.membership.findAll({ where: { gymId: this.Id } })
  console.log(memberships)
  return memberships
}
db.gym.prototype.getClassSchedule = async function () {
  let classSchedule = await db.classSchedule.findAll({
    where: { gymId: this.Id },
  })
  console.log(classSchedule)
  return classSchedule
}

db.gym.hasMany(db.classSchedule)
db.classSchedule.belongsTo(db.gym)

// Define associations
db.activity.belongsTo(db.user, { foreignKey: 'userId' })
db.user.hasMany(db.activity, { foreignKey: 'userId' })

module.exports = db
