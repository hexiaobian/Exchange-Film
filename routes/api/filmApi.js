const express = require('express')
const router = express.Router()
const filmServ = require('../../services/filmService')
const handlerResult = require('../handlerResult')
//获取电影详情
router.get('/filmId', async (req, res) => {
  let filmId = req.query.id
  const result = await filmServ.findById(filmId)
  res.send(handlerResult.getResult(result))
})

//搜索接口
router.get('/search', async (req, res) => {
  const {
    page,
    size,
    keyWords
  } = req.query
  const result = await filmServ.findByName(keyWords, page, size)
  res.send(handlerResult.getResult(result))
})

//筛选接口
router.get('/condition', async (req, res) => {
  const {
    page,
    size,
    type = '全部',
    region = '全部'
  } = req.query
  let filterWords = {
    type,
    region
  }
  const result = await filmServ.findByOther(filterWords, page, size)
  res.send(handlerResult.getResult(result))
})

//电影类型接口
router.get('/category', async (req, res) => {
  const {
    page,
    size,
    category
  } = req.query
  const result = await filmServ.findByCategory({
    category,
    page,
    size
  })
  res.send(handlerResult.getResult(result))
})

//分页查找
router.get('/', async (req, res) => {
  let {
    page,
    size
  } = req.query
  const result = await filmServ.findByPage(Number(page), Number(size))
  res.send(handlerResult.getResult(result))
})

//更新影片数据
router.put('/', async (req, res) => {
  let {
    filmObj
  } = req.body
  const result = await filmServ.updateFilm(filmObj)
  res.send(handlerResult.getResult(result))
})

//新增影片数据
router.post('/', async (req, res) => {
  let {
    filmObj
  } = req.body
  let result = null
  try {
    result = await filmServ.addFilm(filmObj)
    res.send(handlerResult.getResult(result))
  } catch (e) {
    res.send(handlerResult.getErr(e.message))
  }
})

//删除影片数据
router.delete('/', async (req, res) => {
  let {
    filmId
  } = req.body
  try {
    const result = await filmServ.deleteFilm(filmId)
    res.send(handlerResult.getResult(result.length))
  } catch (err) {
    res.send(handlerResult.getErr(err.message))
  }
})

router.get('/all', async (req, res) => {
  const result = await filmServ.findAllFilms()
  res.send(handlerResult.getResult(result))
})

module.exports = router
