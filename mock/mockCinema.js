const Mock = require('mockjs')
const Cinema = require('../models/cinema_info')

const result = Mock.mock({
  "cinemas|50": [{
    'name': '@ctitle(5,7)电影院',
    'location': '@ctitle(8,12)区',
    'city|1': ['广州', '深圳', '厦门', '北京', '上海', '武汉', '重庆'],
    'netTime': '@datetime()'
  }]
}).cinemas

async function createCinema() {
  const data = result.map(e => ({
    name: e.name,
    location: e.location,
    city: e.city,
    netTime: e.netTime
  }))
  await Cinema.bulkCreate(data)
  console.log('完成！')
}
createCinema()
