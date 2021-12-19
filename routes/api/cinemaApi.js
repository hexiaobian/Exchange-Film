const express = require('express')
const router = express.Router()
const cinemaServ = require('../../services/cinemaService')

const handlerResult = require('../handlerResult')

//获取单个影院
router.get('/cinemaId', async (req, res) => {
  const result = await cinemaServ.findById(req.query.cinemaId)
  res.send(handlerResult.getResult(result))
})

//添加影院
router.post('/', async (req, res) => {
  let {
    cinemaObj
  } = req.body
  try {
    const result = await cinemaServ.addCinema(cinemaObj)
    res.send(handlerResult.getResult(result))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }
})

//分页获取所有影院的数据
router.get('/', async (req, res) => {
  let {
    page,
    size
  } = req.query
  const result = await cinemaServ.findAll(Number(page), Number(size))
  res.send(handlerResult.getResult(result))
})
//根据id更新影院数据
router.put('/:cinemaId', async (req, res) => {
  let cinemaObj = req.body
  const result = await cinemaServ.updateCinema(cinemaObj)
  res.send(handlerResult.getResult(result.length))
})

//根据id删除影院相关数据
router.delete('/:cinemaId', async (req, res) => {
  let {
    cinemaId
  } = req.body
  try {
    const result = await cinemaServ.destroyCinema(cinemaId)
    res.send(handlerResult.getResult(result.length))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }

})

//获取影院所有数据
router.get('/all', async (req, res) => {
  const result = await cinemaServ.findAllCinemas()
  res.send(handlerResult.getResult(result))
})
module.exports = router
