const User = require('../models/user_info')
const Mock = require('mockjs')
const md5 = require('md5')
const result = Mock.mock({
  'users|30-50': [{
    'account': /^1[356789]\d{9}$/,
    'regexp': /[\w\d_]{6,12}/,
    //md5加密密码
    'password': function () {
      return md5(this.regexp)
    },
    'nickname': '@title(3)'
  }]
}).users

/**
 * 批量模拟用户数据
 */
async function createUsers() {
  const data = result.map(e => ({
    account: e.account,
    password: e.password,
    nickname: e.nickname
  }))
  await User.bulkCreate(data)
  console.log('完成！')
}
createUsers()
