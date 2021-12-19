const sequelize = require('./db')
const Cinema = require('./cinema_info')
const Film = require('./film_info')
const Manager = require('./manager_info')
const User = require('./user_info')
const Tickets = require('./tickets_info')
const Order = require('./order_info')
const Schedule = require('./schedule_info')
const Exchange = require('./exchange_info')



async function init() {
  await sequelize.sync({
    alter: true
  });
  // //订单与影票之间的一对多关系
  // Film.hasMany(Tickets)
  // Tickets.belongsTo(Film)
  // Cinema.hasMany(Tickets)
  // Tickets.belongsTo(Cinema)
  // User.hasMany(Tickets)
  // Tickets.belongsTo(User)
  // //用户与订单之间的一对多关系
  // User.hasMany(Order)
  // Order.belongsTo(User)



  //创建影院与影片之间的多对多关系,排片表为联结表
  // Cinema.belongsToMany(Film, {
  //   through: 'Schedule'
  // });
  // Film.belongsToMany(Cinema, {
  //   through: 'Schedule'
  // });
  console.log("所有模型均已成功同步.");
}

init()
