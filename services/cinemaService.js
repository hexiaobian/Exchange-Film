const {
  Op
} = require("sequelize");
const Cinema = require('../models/cinema_info');
const Schedule = require('../models/schedule_info');


//新增影院
exports.addCinema = async function (cinemaObj) {
  let {
    name,
    location,
    city
  } = cinemaObj
  let existData = Cinema.findOne({
    where: {
      name,
      location,
      city
    }
  })
  if (existData !== null) {
    throw new Error('该影院已经存在，请勿重新添加！')
  } else {
    const result = await Cinema.create(cinemaObj)
    return result.toJSON()
  }
}

// 通过id获取影院具体信息
exports.findById = async function (id) {
  const result = await Cinema.findByPk(id)
  return result.toJSON()
}

//根据id删除影院相关数据
exports.destroyCinema = async function (id) {
  let sres = await Schedule.findOne({
    where: {
      cinemaId: id
    }
  })

  if (sres !== null && JSON.parse(JSON.stringify(sres)).id != undefined) {
    throw new Error('该影院存在排片信息，不可删除！')
  } else {
    const result = await Cinema.destroy({
      where: {
        id
      }
    })
    return result
  }

}

//通过id更新影院数据
exports.updateCinema = async function (cinemaObj) {
  let {
    id,
    name,
    location,
    city
  } = cinemaObj
  const result = await Cinema.update({
    name,
    location,
    city
  }, {
    where: {
      id
    }
  })
  return result
}

//分页查询影院数据
exports.findAll = async function (page = 1, size = 10) {
  const result = await Cinema.findAndCountAll({
    limit: size,
    offset: (page - 1) * size,
    attributes: ['id', 'name', 'location', 'netTime', 'city']
  })
  const total = result.count
  const datas = JSON.parse(JSON.stringify(result.rows))
  return {
    total,
    datas
  }
}

//获取影院的所有数据（id和名字）
exports.findAllCinemas = async function () {
  let result = await Cinema.findAll({
    attributes: ['id', 'name']
  })
  return JSON.parse(JSON.stringify(result))
}
