const {
  Op
} = require("sequelize");
const Tickets = require('../models/tickets_info')
const Order = require('../models/order_info')


//根据影票信息查询影票,用于解决是否可以删除排片信息，若对应有订单(true)，则不能删除排片信息
exports.searchTickets = async function (obj) {
  let {
    filmId,
    cinemaId,
    schedule,
    price
  } = obj
  const result = await Tickets.findOne({
    where: {
      filmId,
      cinemaId,
      showtime: {
        [Op.eq]: schedule
      },
      price: {
        [Op.eq]: price
      }
    }
  })
  if (result !== null) {
    return true
  } else {
    return false
  }
}

//生成影票
exports.generateTickets = async function (obj) {
  const result = await Tickets.bulkCreate(obj)
  return JSON.parse(JSON.stringify(result))
}
//根据影票id获取影票信息
exports.getOrderById = async function (id) {
  const result = await Tickets.findByPk(id)
  if (result === null) {
    throw new Error('暂无数据')
  }
  return JSON.parse(JSON.stringify(result))
}

//获取某个影院已售的某个电影的电影票信息
exports.getAllTickets = async function (obj) {
  let {
    cinemaId,
    filmId,
    showtime
  } = obj
  let result = await Tickets.findAll({
    where: {
      filmId,
      cinemaId,
      showtime: {
        [Op.eq]: showtime
      }
    },
    attributes: ['seat']
  })
  return result
}

//根据影票id修改影票是否已取票
exports.updateTicket = async function (id, ticketObj) {
  const result = await Tickets.update(ticketObj, {
    where: {
      id
    }
  })
}
//更换影票的用户id
/**
 * 
 * @param {*} id 影票id
 * @param {*} targetId 目标用户id
 */
exports.updateUserId = async function (id, targetId) {
  let {
    userId
  } = await Tickets.findByPk(id)
  if (userId === targetId) {
    throw new Error('此票不可换！')
  }
  await Tickets.update({
    userId: targetId
  }, {
    where: {
      id
    }
  })
  let result = await Tickets.findByPk(id)
  return result
}

// 删除影票
exports.destoryTicket = async function (id, orderId) {
  let tRes = await Tickets.findByPk(id)
  let price = tRes.price
  let oRes = await Order.findByPk(orderId)
  let ticketsIds = JSON.parse(oRes.ticketsIds)
  let ticketIndex = ticketsIds.findIndex(t => t === id)
  let result = null
  if (ticketIndex > -1) {
    ticketsIds.splice(ticketIndex, 1)
    if (ticketsIds.length === 0) {
      result = await Order.destroy({
        where: {
          id: orderId
        }
      })
    } else {
      let orderObj = JSON.parse(JSON.stringify(oRes))
      orderObj.ticketsIds = JSON.stringify(ticketsIds)
      orderObj.dealprice = orderObj.dealprice - price
      result = await Order.update(orderObj, {
        where: {
          id: orderId
        }
      })
    }
    let res = await Tickets.destroy({
      where: {
        id
      }
    })
    let oResult = await Order.findByPk(orderId)
    if (oResult === null) {
      throw new Error('订单已不存在！')
    } else {
      return JSON.parse(JSON.stringify(oResult))
    }
  }
}
