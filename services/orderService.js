const Order = require('../models/order_info')

//生成订单
exports.generateOrder = async function (obj) {
  const result = await Order.create(obj)
  return result.toJSON()
}

//根据用户id得到订单
exports.getOrderByUserId = async function (id) {
  const result = await Order.findAll({
    where: {
      userId: id
    },
    attributes: ['id', 'filmName', 'cinemaName', 'dealTime', 'dealprice', 'orderStatus', 'ticketsIds']
  })
  return JSON.parse(JSON.stringify(result))
}

//更新订单信息
exports.updateOrder = async function (id, orderObj) {
  const result = await Order.update(orderObj, {
    where: {
      id
    }
  })
}

//分页获取所有订单
exports.getAllOrder = async function (page = 1, size = 10) {
  let result = await Order.findAndCountAll({
    limit: size,
    offset: (page - 1) * size
  })
  return JSON.parse(JSON.stringify(result))
}
