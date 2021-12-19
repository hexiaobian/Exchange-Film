const express = require('express')
const router = express.Router()
const Schedule = require('../../services/scheduleService')
const handlerResult = require('../handlerResult')

//根据电影id获取其排片影院或者根据影院id获取电影情况
router.get('/selectBuy', async (req, res) => {
  if (req.query.filmId !== undefined) {
    let id = req.query.filmId
    const result = await Schedule.getCinema(id)
    res.send(handlerResult.getResult(result))
  } else {
    let id = req.query.cinemaId
    const result = await Schedule.getFilm(id)
    res.send(handlerResult.getResult(result))
  }
})
//根据id获取排片情况
router.get('/schedule', async (req, res) => {
  const id = req.query.scheduleId
  const result = await Schedule.getSchedule(id)
  res.send(handlerResult.getResult(result))
})

//修改排片情况
router.put('/', async (req, res) => {
  let {
    id,
    scheduleObj
  } = req.body
  scheduleObj.id = Number(scheduleObj.id)
  scheduleObj.filmId = Number(scheduleObj.filmId)
  scheduleObj.cinemaId = Number(scheduleObj.cinemaId)
  scheduleObj.price = Number(scheduleObj.price)
  try {
    const result = await Schedule.updateSchedule(id, scheduleObj)
    res.send(handlerResult.getResult(result.length))
  } catch (err) {
    res.send(handlerResult.getErr(err.message, 400))
  }
})

//删除排片情况
router.delete('/', async (req, res) => {
  let {
    id
  } = req.body
  try {
    let result = await Schedule.deleteSchedule(id)
    res.send(handlerResult.getResult(result))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }

})
//分页获取排片信息
router.get('/', async (req, res) => {
  let {
    searchObj,
    page,
    size,
  } = req.query
  searchObj = JSON.parse(searchObj)
  const result = await Schedule.findBySearch(searchObj, Number(page), Number(size))
  res.send(handlerResult.getResult(result))
})

//批量排片
router.post('/', async (req, res) => {
  let {
    scheduleArr
  } = req.body
  try {
    const result = await Schedule.generateSchedule(scheduleArr)
    res.send(handlerResult.getResult(result.length))
  } catch (err) {
    res.send(handlerResult.getErr(err.message, 400))
  }

})
module.exports = router
