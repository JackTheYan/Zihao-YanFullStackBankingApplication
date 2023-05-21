'use strict'

const mongoose = require('mongoose')

const Users = mongoose.model('users')
const Balance = mongoose.model('records')
const t_users = require('../mongodb/models/t_users')
const { md5password, createToken } = require('../utils/password')
const { createAccountRecord } = require('./record')
const { CommonError } = require('./../utils/errors')
const logger = require('./../utils/logger')

async function queryUser(input) {
  const { username, email } = input
  const user = await t_users.getUserByParams({ email, username })
  if (!user) {
    return CommonError(-1, '暂无此用户')
  }

  const balance = await Balance.findOne({ email, username })


  return {
    returnCode: 0,
    returnMessage: 'success',
    data: {
      ...balance._doc,
      ...user._doc,
    },
  }
}

async function deleteUser(input) {
  const { username, email, bankId } = input

  try {
    await Users.findOneAndDelete({ email, username })
    await Balance.findOneAndDelete({ email, bankId })
  } catch (err) {
    console.log(err)
    return CommonError(-1, '删除失败')
  }

  return {
    returnCode: 0,
    returnMessage: 'success',
    data: 'success',
  }
}

async function allUserWithBalance(input) {
  console.log(input, '===input')
  const { email, username } = input

  const user = await Users.findOne({ email, username })

  console.log(user, '====1')

  if (!user || user.role !== 1) {
    return CommonError(-1, '无权限查看所有用户')
  }
  try {
    const resp = await Balance.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'email',
          foreignField: 'email',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $addFields: {
          role: '$user.role',
          sortField: '$user.updatedAt',
        },

      },
      { $sort: { sortField: 1 } },
    ])

    console.log(resp, '===resp')

    return {
      returnCode: 0,
      returnMessage: 'success',
      data: resp,
    }
  } catch (err) {
    console.log(err)
    return CommonError(-1, 'some error')
  }
}

async function login(input) {
  const { password, email } = input
  logger.info({ input }, 'login start')
  const user = await Users.findOne({ email })
  if (!user) {
    return CommonError(-1, '该邮箱未创建用户，请先创建')
  }

  const real = md5password(password)

  console.log(real)
  if (real !== user.password) {
    return CommonError(-1, '密码错误')
  }

  const data = { username: user.username, email, role: user.role, birthday: user.birthday, sex: user.sex }

  const token = createToken(real)
  logger.info('login end')


  return {
    data: {
      ...data,
      token,

    },
    returnCode: 0,
    returnMessage: '登录用户成功',
  }
}

async function signUp(input) {
  logger.info({ input }, 'signUp start')
  const { password, username, email, role, birthday, sex } = input

  const user = await Users.findOne({ email })

  if (user) {
    return CommonError(-1, 'User already exists.')
  }

  console.log('========dd')
  const realPass = md5password(password)
  const data = { password: realPass, username, email, role, birthday, sex }

  console.log(data, '--------data')
  await Users.create(data, err => {
    if (err) {
      return CommonError('something error')
    }
  })

  // 创建户头
  await createAccountRecord({ username, email })

  const token = createToken(data)
  logger.info('signUp end')
  return {
    data: {
      username,
      email,
      role,
      token,
      birthday,
      sex,
    },
    returnCode: 0,
    returnMessage: '创建用户成功',
  }
}

async function loginGithub(input) {
  const { username, email, password } = input

  const user = await Users.findOne({ email })

  if (!user) {
    return signUp({
      username,
      email,
      password,
      role: 1,
    })
  }
  return login({ password, email })
}


module.exports = {
  login,
  signUp,
  allUserWithBalance,
  deleteUser,
  queryUser,
  loginGithub,
}
