const query = require('../config/db.js')
const { v4: uuidv4 } = require('uuid')

//const dbUtils = require('../utils/dbutils.js')
const tableName = 'user'
//const tableName1 = 'Subscriptions'

const createUser = async (firstname, lastname, email, password) => {
  const sql = `INSERT INTO gym.${tableName} (firstname, lastname, email, password) VALUES (?,?,?,?)`
  const result = await query(sql, [firstname, lastname, email, password])
  const affectedRows = result ? result.affectedRows : 0
  return affectedRows
}

const checkEmailExisted1 = async (userUUID) => {
  const { columnSet, values } = dbUtils.multipleColumnSet({
    email: email,
  })
  const sql = `SELECT * FROM ${tableName} WHERE ${columnSet}`
  const result = await query(sql, [...values])
  console.log(result)
  return result.map(function (i) {
    return new Subscription(i)
  })
}
module.exports = { createUser }
