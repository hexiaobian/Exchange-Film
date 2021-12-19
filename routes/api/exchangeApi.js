const express = require('express')
const router = express.Router()
const exchangeServ = require('../../services/exchangeService')
const handlerResult = require('../handlerResult')

//生成换票信息
router.post('/saleTicket', async (req, res) => {
  let {
    exchangeObj
  } = req.body
  try {
    let result = await exchangeServ.generateExchange(exchangeObj)
    res.send(handlerResult.getResult(result))
  } catch (e) {
    let err = e.message
    res.send(handlerResult.getErr(err))
  }
})

//根据用户id获得用户所有的换票信息
router.get('/judgeByUserId', async (req, res) => {
  let {
    userId
  } = req.query
  let result = await exchangeServ.judgeByUserId(userId)
  res.send(handlerResult.getResult(result))
})
//查询某个用户所有的换票记录
router.get('/selectUserAll', async (req, res) => {
  let {
    userId
  } = req.query
  let result = await exchangeServ.selectUserAll(userId)
  res.send(handlerResult.getResult(result))
})

//分页获取所有的换票信息
router.get('/selectAll', async (req, res) => {
  let result = await exchangeServ.selectAll()
  res.send(handlerResult.getResult(result))
})

//过滤已换的换票记录
router.get('/filterExchange', async (req, res) => {
  let result = await exchangeServ.filterExchange()
  res.send(handlerResult.getResult(result))
})
//删除某条换票记录
router.delete('/deleteExchange', async (req, res) => {
  let {
    ticketId
  } = req.query
  try {
    let result = await exchangeServ.deleteExchange(ticketId)
    res.send(handlerResult.getResult(result))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }
})

//更改换票记录中的目标用户
router.put('/saleExchange', async (req, res) => {
  let {
    originObj,
    targetObj,
    balance
  } = req.body
  try {
    let result = await exchangeServ.saleExchange(originObj, targetObj, balance)
    res.send(handlerResult.getResult(result))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }
})

module.exports = router
