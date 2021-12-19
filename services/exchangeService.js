const {
  Op,
  or
} = require("sequelize");
const Exchange = require('../models/exchange_info')
const Tickets = require('./ticketsService')
const Film = require('./filmService')
const Cinema = require('./cinemaService')
const Order = require('./orderService')
const User = require('./userService')
const moment = require('moment')
const {
  v4: uuidv4
} = require('uuid');

//判断电影票是否已被换
let findExchanged = async function (id) {
  let result = await Exchange.findOne({
    where: {
      ticketId: id
    }
  })
  if (result != null) {
    return true
  }
  return false
}

//生成换票信息
exports.generateExchange = async function (exchangeObj) {
  let {
    ticketId
  } = exchangeObj
  let isChanged = await findExchanged(ticketId)
  if (isChanged) {
    throw new Error('此电影票不可换！')
  }
  let result = await Exchange.create(exchangeObj)
  return result.toJSON()
}
//查找某个用户所有的换票信息，不包含已换记录(只包含未换且未过期的换票信息)
exports.judgeByUserId = async function (userId) {
  let result = await Exchange.findAll({
    where: {
      [Op.and]: [{
          userId
        },
        {
          targetId: {
            [Op.is]: null
          }
        }
      ]
    }
  })
  if (result != null) {
    let exchangeObj = JSON.parse(JSON.stringify(result))
    let finalExchange = []
    for (let i = 0; i < exchangeObj.length; i++) {
      const result = await Tickets.getOrderById(exchangeObj[i].ticketId)
      if (new Date(result.showtime) > new Date()) {
        finalExchange.push(exchangeObj[i])
      }
    }
    return finalExchange
  }
}
//查询某个用户所有的换票记录，用于用户的个人换票区数据的展示
exports.selectUserAll = async function (userId) {
  let result = await Exchange.findAll({
    where: {
      userId
    }
  })
  if (result === null) {
    throw new Error('无换票记录！')
  }
  return await Promise.all(JSON.parse(JSON.stringify(result)).map(async e => {
    let ticketObj = await Tickets.getOrderById(e.ticketId)
    let targetExchange = await Exchange.findOne({
      where: {
        uuid: e.uuid
      }
    })

    if (e.isEquival && targetExchange.isEquival) {
      e.price = 0
    } else {
      e.price = e.discount - targetExchange.discount
    }
    e.price = e.price.toFixed(2)
    let filmObj = await Film.findById(ticketObj.filmId)
    let cinemaObj = await Cinema.findById(ticketObj.cinemaId)
    e.filmName = filmObj.name
    e.cinemaName = cinemaObj.name
    if (e.targetId === null) {
      if (+new Date(ticketObj.showtime) < +new Date()) {
        e.case = '交易失败'
      } else {
        e.case = '正在交易'
      }
    } else {
      let targetObj = await User.findUserById(e.targetId)
      e.targetAccount = targetObj.account.substr(0, 3) + '*'.repeat(5) + targetObj.account.substr(8)
      e.case = '交易成功'
    }
    return {
      case: e.case,
      cinemaName: e.cinemaName,
      filmName: e.filmName,
      price: e.price,
      targetAccount: e.targetAccount,
      type: e.type,
      isDeal: e.isDeal,
      showtime: moment(ticketObj.showtime).format('YYYY-MM-DD HH:mm:ss'),
      dealtime: e.dealtime ? moment(e.dealtime).format('YYYY-MM-DD HH:mm:ss') : '无'
    }
  }))
}
//分页查询所有换票记录
exports.selectAll = async function (page, size) {
  page = page || 1
  size = size || 10
  let result = await Exchange.findAndCountAll({
    limit: size,
    offset: size * (page - 1)
  })
  return JSON.parse(JSON.stringify(result))
}

//根据影票id删除对应的换票记录
exports.deleteExchange = async function (ticketId) {
  let result = await Exchange.destroy({
    where: {
      ticketId
    }
  })
  if (result > 0) {
    return {
      msg: '删除成功！'
    }
  } else {
    throw new Error('无可删除的数据！')
  }
}

//过滤未被换的影票
exports.filterExchange = async function () {
  let fResult = await Exchange.findAll({
    where: {
      targetId: {
        [Op.is]: null
      }
    }
  })
  let finalResult = []
  fResult = JSON.parse(JSON.stringify(fResult))
  for (let i = 0; i < fResult.length; i++) {
    let t = await Tickets.getOrderById(fResult[i].ticketId)
    if (new Date(t.showtime) > new Date()) {
      finalResult.push(fResult[i])
    }
  }
  return finalResult
}

//过滤未换成功的电影票
exports.filterLoseExchange = async function () {
  let loseResult = await Exchange.findAll({
    where: {
      targetId: {
        [Op.is]: null
      }
    }
  })
  if (loseResult != null) {
    JSON.parse(JSON.stringify(fResult))
  }
}

//用户在换票区换票成功
/**
 * 
 * @param {*} exchangeId 换票记录的id
 * @param {*} targetId 目标用户的id
 */
exports.saleExchange = async function (originObj, targetObj, balance) {
  let uuid = uuidv4()
  let {
    originExchangeId,
    originTargetId
  } = originObj
  let {
    targetExchangeId,
    targetId
  } = targetObj
  try {
    await generate(originExchangeId, uuid, originTargetId, balance)
    await generate(targetExchangeId, uuid, targetId, balance)
    return true
  } catch (e) {
    throw new Error(e.message)
  }
}
let generate = async function (exchangeId, uuid, targetId, balance) {
  let origin = await Exchange.findByPk(exchangeId)
  if (origin.targetId !== null) {
    throw new Error('此票已换出！')
  }
  let isEquival = false
  //更新换票记录
  if (balance === 0) {
    isEquival = true
  }
  await Exchange.update({
    targetId,
    uuid,
    isEquival,
    isDeal: true,
    dealtime: new Date()
  }, {
    where: {
      id: exchangeId
    }
  })
  //更新影票

  await Tickets.updateUserId(origin.ticketId, targetId)
  // let {
  //   userId,
  //   id,
  //   filmId,
  //   cinemaId,
  //   updatedAt
  // } = tResult
  // let fResult = await Film.findById(filmId)
  // let filmName = fResult.name
  // let cResult = await Cinema.findById(cinemaId)
  // let cinemaName = cResult.name
  // const params = {
  //   userId,
  //   ticketsIds: JSON.stringify([id]),
  //   filmName,
  //   cinemaName,
  //   dealTime: moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
  //   dealprice: balance
  // };
  // let oResult = await Order.generateOrder(params)
  // return
}
