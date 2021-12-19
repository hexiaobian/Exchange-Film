const Admin = require('../models/manager_info')
const md5 = require('md5')
const Validate = require('validate.js')

function validateManager(adminObj) {
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
    name: {
      presence: true,
      type: 'string'
    }
  }
  return Validate.validate(adminObj, rules)
}

/**
 * 添加管理员
 * @param {*} adminObj 
 */
exports.addAdmin = async function (adminObj) {
  const res = validateManager(adminObj)
  if (!res) {
    adminObj.password = md5(adminObj.password)
    const admin = await Admin.create(adminObj)
    return admin.toJSON()
  } else {
    return res
  }
}
/**
 * 删除管理员
 * @param {*} adminId 
 */
exports.deleteAdmin = async function (adminId) {
  await Admin.destroy({
    where: {
      id: adminId
    }
  })
}

/**
 * 修改管理员
 * @param {*} id 
 * @param {*} adminObj 
 */
exports.updateAdmin = async function (id, adminObj) {
  const res = validateManager(adminObj)
  if (!res) {
    const result = JSON.parse(JSON.stringify(await Admin.findByPk(id)))
    if (adminObj.account !== result.account) return
    adminObj.password = md5(adminObj.password)
    await Admin.update(adminObj, {
      where: {
        id
      }
    })
  }
}

//登录
exports.login = async function (managerObj) {
  managerObj.password = md5(managerObj.password)
  const result = await Admin.findOne({
    where: {
      account: managerObj.account,
      password: managerObj.password
    },
    attributes: ['id', 'account', 'name']
  })
  return result.toJSON()
}
