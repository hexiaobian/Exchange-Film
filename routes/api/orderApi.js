const express = require('express')
const Order = require('../../models/order_info')
const router = express.Router()
const orderServ = require('../../services/orderService')
const handlerResult = require('../handlerResult')

//生成订单
router.post('/add', async (req, res) => {
  let obj = req.body
  let result = await orderServ.generateOrder(obj)
  res.send(handlerResult.getResult(JSON.parse(JSON.stringify(result))))
})
//获取某个用户的订单信息
router.get('/find', async (req, res) => {
  let {
    userId
  } = req.query
  let result = await orderServ.getOrderByUserId(userId)
  res.send(handlerResult.getResult(JSON.parse(JSON.stringify(result))))
})
//更新订单信息
router.put('/update', async (req, res) => {
  let {
    id,
    orderObj
  } = req.body
  let result = await orderServ.updateOrder(id, orderObj)
  res.send(handlerResult.getResult(1))
})

//分页获取所有订单
router.get('/', async (req, res) => {
  let {
    page,
    size
  } = req.query
  let result = await orderServ.getAllOrder(Number(page), Number(size))
  res.send(handlerResult.getResult(result))
})
module.exports = router
