const express = require('express')
const app = express()
const mockSchedule = require('../mock/mockSchedule')
//映射静态资源
const path = require('path')
const staticRoot = path.resolve(__dirname, '../public')
app.use(express.static(staticRoot))

//处理跨域
app.use(require('./corsMiddleware'))

//解析application/x-www-form-urlencoded格式的请求体
app.use(express.urlencoded({
  extended: true
}))
//解析application/json格式的请求体
app.use(express.json())


app.use('/api/user', require('./api/userApi'))
app.use('/api/manager', require('./api/managerApi'))
app.use('/api/film', require('./api/filmApi'))
app.use('/api/schedule', require('./api/scheduleApi'))
app.use('/api/cinema', require('./api/cinemaApi'))
app.use('/api/tickets', require('./api/ticketsApi'))
app.use('/api/order', require('./api/orderApi'))
app.use('/api/exchange', require('./api/exchangeApi'))


app.use(require('./errorMiddleware'))
app.listen(4000, async () => {
  await mockSchedule()
  const r = setInterval(async () => {
    await mockSchedule()
    clearInterval(r)
  }, 86400000)
  console.log('成功！')
})
