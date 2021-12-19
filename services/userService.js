const User = require('../models/user_info')
const md5 = require('md5')
const Validate = require('validate.js')

function validateUser(userObj) {
  const rules = {
    account: {
      presence: true,
      length: {
        is: 11
      },
      type: 'string'
    },
    password: {
      presence: true,
      length: {
        minimum: 4,
        maximum: 12
      },
      type: 'string'
    },
    comfirmPass: {
      equality: "password"
    }
  }
  return Validate.validate(userObj, rules)
}
/**
 * 用户登录
 * @param {*} account 用户名
 * @param {*} password 密码
 */
exports.login = async function (userObj) {
  const res = validateUser(userObj)
  let {
    account,
    password
  } = userObj

  password = md5(password)
  if (!res) {
    const isUser = await User.findOne({
      where: {
        account,
        password
      },
      attributes: ['id', 'account', 'nickname']
    })
    if (isUser === null) {
      throw new Error('账号或密码错误！')
    } else {
      return JSON.parse(JSON.stringify(isUser.dataValues))
    }
  }
}
/**
 * 修改用户信息
 * @param {*} id 用户id
 * @param {*} userObj 用户信息
 */
exports.updateInfo = async function (id, userObj) {
  const res = validateUser(userObj)
  const result = JSON.parse(JSON.stringify(await User.findByPk(id)))
  userObj.password = md5(userObj.password)
  if (userObj.account === result.account && userObj.password === result.password && (userObj.nickname == null || userObj.nickname === result.nickname)) {
    return
  }
  if (userObj.account !== result.account) throw new Error('账号不能修改！')
  if (!res) {
    return await User.update(userObj, {
      where: {
        id
      }
    })
  }
}

//检查用户是否存在
exports.checkUser = async function (account) {
  const info = await User.findOne({
    where: {
      account
    },
  })
  if (info !== null) throw new Error('用户名已存在！')
  return info
}
/**
 * 添加用户信息
 * @param {*} userObj 
 */
exports.addUser = async function (userObj) {
  const res = validateUser(userObj)
  if (!res) {
    const info = await User.findOne({
      where: {
        account: userObj.account
      },
    })
    if (info !== null) throw new Error('用户名已存在！')
    userObj.password = md5(userObj.password)
    const result = await User.create(userObj)
    return result.toJSON()
  }
}


/**
 * 分页查询用户信息
 * @param {*} page 页码
 * @param {*} size 页容量
 */
exports.queryByPage = async function (page = 1, size = 10) {
  const result = await User.findAndCountAll({
    offset: size * (page - 1),
    limit: size,
    attributes: ['account', 'nickname']
  })
  const total = result.count
  const datas = JSON.parse(JSON.stringify(result.rows))
  return {
    total,
    datas
  }
}

//通过用户id获取用户信息（id和账号）
exports.findUserById = async function (id) {
  const result = await User.findByPk(id)
  return JSON.parse(JSON.stringify(result))
}
