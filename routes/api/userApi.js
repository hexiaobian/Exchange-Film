const express = require('express')
const router = express.Router()
const userServ = require('../../services/userService')
const handlerResult = require('../handlerResult')

// 分页获取用户信息
router.get('/', async (req, res) => {
  let {
    page,
    size
  } = req.query
  const result = await userServ.queryByPage(Number(page), Number(size))
  res.send(handlerResult.getResult(result))
})

//获取用户信息（id,account）
router.get('/info', async (req, res) => {
  let {
    id
  } = req.query
  const result = await userServ.findUserById(id)
  res.send(handlerResult.getResult(result))
})
// 用户登录
router.post('/login', async (req, res) => {
  const {
    account,
    password
  } = req.body
  const result = await userServ.login({
    account,
    password
  })
  if (result === null) {
    res.status(handlerResult.getErr().code)
    res.send(handlerResult.getErr())
    // return handlerResult.getErr()
  } else {
    res.send(handlerResult.getResult(result))
    // return result
  }
})
//检查用户是否已存在
router.get('/checkUser', async (req, res, next) => {
  const {
    account
  } = req.query
  try {
    await userServ.checkUser(account)
    res.send(handlerResult.getResult())
  } catch (e) {
    res.send(handlerResult.getErr(e.message))
  }
})
// 用户注册
router.post('/register', async (req, res, next) => {
  const {
    account,
    password,
    comfirmPass,
    nickname
  } = req.body
  try {
    const result = await userServ.addUser({
      account,
      password,
      comfirmPass,
      nickname
    })
    let finalResult = {
      id: result.id,
      account: result.account,
      nickname: result.nickname
    }
    res.send(handlerResult.getResult(finalResult))
  } catch (e) {
    res.send(handlerResult.getErr(e.message))
  }
})

// 修改用户信息
router.put('/:id', async (req, res, next) => {
  try {
    const result = await userServ.updateInfo(req.params.id, req.body)
    if (result === undefined) {
      res.status(200).send(await handlerResult.getResult('未修改用户信息!'))
      next()
    }
    if (result) {
      res.send(await handlerResult.getResult('已修改用户信息!'))
      return await handlerResult.getResult('已修改用户信息!')
    }
  } catch (e) {
    next(e)
  }
})
module.exports = router
