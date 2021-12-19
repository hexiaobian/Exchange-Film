const Admin = require('../models/manager_info')
const Mock = require('mockjs')
const md5 = require('md5')
const result = Mock.mock({
  'admins|5-10': [{
    'account': /^1[356789]\d{9}$/,
    'regexp': /[\w\d_]{6,12}/,
    //md5加密密码
    'password': function () {
      return md5(this.regexp)
    },
    'name': '@cname'
  }]
}).admins
/**
 * 批量添加管理员
 */
async function createAdmins() {
  const data = result.map(e => ({
    account: e.account,
    password: e.password,
    name: e.name
  }))
  await Admin.bulkCreate(data)
  console.log('完成！')
}
createAdmins()
