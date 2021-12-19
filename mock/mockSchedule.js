const Mock = require('mockjs')
const Schedule = require('../models/schedule_info')
const {
  Op
} = require("sequelize");



//删除掉一些过期数据，增加相等数量的新数据
async function destroyData() {
  let result = await Schedule.findAll({
    where: {
      schedule: {
        [Op.lt]: new Date()
      }
    }
  })
  if (result.length === 0) {
    console.log('暂无数据更新！')
    return
  }
  let resultArr = JSON.parse(JSON.stringify(result))
  let num = resultArr.length
  let proms = []
  for (let i = 0; i < num; i++) {
    proms.push(await Schedule.destroy({
      where: {
        id: resultArr[i].id
      }
    }))
  }
  Promise.all(proms).then(async res => {
    const option = {}
    option['schedules|' + num] = [{
      'filmId': /[1-9]/,
      'cinemaId|1-20': 1,
      'schedule': function () {
        //删除过期数据，造第三天的数据
        let cTime = new Date().setHours(0, 0, 0, 0) + 86400000 * 2 + 86400000 * Math.random()
        return new Date(cTime)
      },
      'price': '@float(20, 45, 0, 1)'
    }]
    let list = Mock.mock(option).schedules
    await createShedule(list)
  })
}



async function createShedule(result) {
  if (result instanceof Array) {
    const data = result.map(e => {
      e.filmId = Number(e.filmId)
      return e
    })
    await Schedule.bulkCreate(data)
  } else {
    result.filmId = Number(result.filmId)
    await Schedule.create(result)
  }
  console.log('完成！')
}
module.exports = destroyData
