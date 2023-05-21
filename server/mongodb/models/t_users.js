'use strict'

const mongoose = require('mongoose')

const Users = mongoose.model('users')


async function getUserByParams(data) {
  const user = await Users.findOne(data)
  return user
}

async function deleteUser(data) {
  const res = await Users.findOneAndDelete(data)
  return res
}

async function createUser(data) {
  const res = await Users.create(data)
  return res
}


module.exports = {
  getUserByParams,
  deleteUser,
  createUser,

}
