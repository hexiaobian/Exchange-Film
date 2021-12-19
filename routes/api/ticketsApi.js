const express = require('express')
const router = express.Router()
const ticketsServ = require('../../services/ticketsService')
const handlerResult = require('../handlerResult')

//购票
router.post('/buy', async (req, res) => {
  let obj = req.body
  let result = await ticketsServ.generateTickets(obj)
  res.send(handlerResult.getResult(result))
})

//判断座位是否已被购买
router.get('/exist', async (req, res) => {
  let obj = req.query
  let result = await ticketsServ.getAllTickets(obj)
  res.send(handlerResult.getResult(result))
})

//根据影票id获取影票信息
router.get('/:id', async (req, res) => {
  let {
    id
  } = req.params
  try {
    let result = await ticketsServ.getOrderById(id)
    res.send(handlerResult.getResult(JSON.parse(JSON.stringify(result))))
  } catch (err) {
    res.send(handlerResult.getErr(err.message, 404))
  }
})
//更新
router.put('/update', async (req, res) => {
  let {
    id,
    ticketObj
  } = req.body
  let result = await ticketsServ.updateTicket(id, ticketObj)
  res.send(handlerResult.getResult(1))
})
//删除影票
router.delete('/', async (req, res) => {
  let {
    id,
    orderId
  } = req.body
  let result = null
  try {
    result = await ticketsServ.destoryTicket(id, orderId)
    res.send(handlerResult.getResult(result))
  } catch (err) {
    res.send(handlerResult.getErr(err.message, 404))
  }
})

module.exports = router
