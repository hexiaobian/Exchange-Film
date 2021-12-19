const {
  Op
} = require("sequelize");
const sequelize = require('../models/db');

const Schedule = require('../models/schedule_info')

const cinema = require('./cinemaService')
const film = require('./filmService')
const tickets = require('./ticketsService')

//根据排片id获取排片情况
exports.getSchedule = async function (id) {
  const result = await Schedule.findByPk(id)
  return result.toJSON()
}

//分页获取所有的排片情况
getAllSchedule = async function (where, page = 1, size = 10) {
  let result = await Schedule.findAndCountAll({
    where,
    limit: size,
    offset: (page - 1) * size,
    attributes: ['id', 'filmId', 'cinemaId', 'price', 'schedule']
  })
  let count = result.count
  result = JSON.parse(JSON.stringify(result)).rows
  const res = result.map(async r => {
    let fRes = await film.findById(
      r.filmId
    )
    let cRes = await cinema.findById(r.cinemaId)
    return {
      id: r.id,
      filmId: r.filmId,
      cinemaId: r.cinemaId,
      filmName: fRes.name,
      cinemaName: cRes.name,
      price: r.price,
      schedule: r.schedule
    }
  })
  let r = await Promise.all(res)
  return {
    count,
    data: r
  }

}
// 根据影片id获取影院id(?详情)
exports.getCinema = async function (id) {
  const resIds = await Schedule.findAll({
    where: {
      filmId: id
    },
  })
  let schedule = JSON.parse(JSON.stringify(resIds))
  let proms = resIds.map(async r => {
    let rRes = await cinema.findById(r.cinemaId)
    return rRes
  })

  let result = await Promise.all(proms).then(res => {
    return res
  })
  return {
    cinemas: result,
    schedule
  }
}

//根据影院id获取影片id（？详情）
exports.getFilm = async function (id) {
  const resIds = await Schedule.findAll({
    where: {
      cinemaId: id
    },
  })
  let schedule = JSON.parse(JSON.stringify(resIds))
  let proms = resIds.map(async r => {
    let rRes = await film.findById(r.filmId)
    return rRes
  })
  let result = await Promise.all(proms).then(res => {
    return res
  })
  return {
    films: result,
    schedule
  }
}

//批量排片
exports.generateSchedule = async function (scheduleArr) {
  let all = await Schedule.findAll({
    attributes: ['filmId', 'cinemaId', 'price', 'schedule']
  })
  let allSchedule = JSON.parse(JSON.stringify(all)).map(s => JSON.stringify(s))
  let schedules = scheduleArr.map(s => JSON.stringify(s))
  let oldLen = allSchedule.length + schedules.length
  let newLen = [...new Set([...allSchedule, ...schedules])].length
  if (oldLen > newLen) {
    throw new Error('此时间点已有排片，请重新选择时间！')
  }
  let result = await Schedule.bulkCreate(scheduleArr)
  return JSON.parse(JSON.stringify(result))
}

//根据id修改排片情况
exports.updateSchedule = async function (id, scheduleObj) {
  let {
    schedule,
    filmId,
    cinemaId
  } = scheduleObj
  if (new Date(schedule) < new Date()) {
    throw new Error('修改排片时间不能在当前时间之前！')
  }
  let existData = await Schedule.findOne({
    where: {
      schedule: {
        [Op.eq]: schedule
      },
      filmId,
      cinemaId
    }
  })
  if (existData !== null) {
    throw new Error('此时间点该影片已有排片，请勿重复排片！')
  }
  let oldObj = await Schedule.findOne({
    where: {
      id
    },
    attributes: ['id', 'filmId', 'cinemaId', 'schedule', 'price']
  })
  oldObj = JSON.parse(JSON.stringify(oldObj))
  oldObj.schedule = new Date(oldObj.schedule).valueOf()
  scheduleObj.schedule = new Date(scheduleObj.schedule).valueOf()
  if (JSON.stringify(oldObj) === JSON.stringify(scheduleObj)) {
    throw new Error('您未修改任何信息！')
  }
  let result = await Schedule.update(scheduleObj, {
    where: {
      id
    }
  })
  return result
}

//删除排片情况
exports.deleteSchedule = async function (id) {
  let res = await Schedule.findByPk(id)
  if (res !== null) {
    const hasTickets = await tickets.searchTickets(res.toJSON())
    if (hasTickets) {
      throw new Error('此排片情况已售出影票，不能删除！')
    } else {
      let result = await Schedule.destroy({
        where: {
          id
        }
      })
      return result
    }
  } else {
    throw new Error('排片不存在！')
  }
}


//条件查找排片情况
exports.findBySearch = async function (searchObj, page, size) {
  let {
    filmId,
    cinemaId,
    datetime
  } = searchObj
  let where = {}
  if (filmId === undefined && cinemaId === undefined && datetime === undefined) {
    where = {}
  } else if (filmId !== undefined && cinemaId === undefined && datetime === undefined) {
    where = {
      filmId: {
        [Op.eq]: filmId
      },
    }
  } else if (filmId === undefined && cinemaId !== undefined && datetime === undefined) {
    where = {
      cinemaId: {
        [Op.eq]: cinemaId
      }
    }
  } else if (filmId === undefined && cinemaId === undefined && datetime !== undefined) {
    where = {
      schedule: {
        [Op.lt]: datetime
      }
    }
  } else if (filmId !== undefined && cinemaId !== undefined && datetime === undefined) {
    where = {
      [Op.and]: {
        filmId: {
          [Op.eq]: filmId
        },
        cinemaId: {
          [Op.eq]: cinemaId
        }
      }
    }
  } else if (filmId !== undefined && cinemaId === undefined && datetime !== undefined) {
    where = {
      [Op.and]: {
        filmId: {
          [Op.eq]: filmId
        },
        schedule: {
          [Op.lt]: datetime
        }
      }
    }
  } else if (filmId === undefined && cinemaId !== undefined && datetime !== undefined) {
    where = {
      [Op.and]: {
        cinemaId: {
          [Op.eq]: cinemaId
        },
        schedule: {
          [Op.lt]: datetime
        }
      }
    }
  } else {
    where = {
      [Op.and]: {
        filmId: {
          [Op.eq]: filmId
        },
        cinemaId: {
          [Op.eq]: cinemaId
        },
        schedule: {
          [Op.lt]: datetime
        }
      }
    }
  }
  return await getAllSchedule(where, page, size)
}
