const express = require('express')
const router = express.Router()
const managerServ = require('../../services/managerService')
const handlerResult = require('../handlerResult')


//管理员登录
router.post('/login', async (req, res) => {
  const {
    account,
    password
  } = req.body
  const result = await managerServ.login({
    account,
    password
  })
  if (result === null) {
    res.status(handlerResult.getErr().code)
    res.send(handlerResult.getErr())
    return handlerResult.getErr()
  } else {
    res.send(handlerResult.getResult(result))
  }
})

module.exports = router
