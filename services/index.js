// const managerServ = require('./managerService')
// const userServ = require('./userService')
// async function addUser() {
//   const result = await userServ.addUser({
//     account: '15521197709',
//     password: '20190902'
//   })
//   console.log(result)
// }
// addUser()
// async function queryByPage() {
//   const result = await managerServ.updateAdmin(25, {
//     id: 25,
//     account: '18277263174',
//     password: 1213,
//     name: '康娟'
//   })
//   console.log(result)
// }
// managerServ.addAdmin({
//   account: '13521197708',
//   password: '12w1',
//   name: '何小变'
// })
// queryByPage()
// async function login() {
//   const result = await userServ.login('16581503485')
//   console.log(result)
// }
// const Film = require('./filmService')
// async function film() {
//   await Film.findAllFilms()
// }
// film()
// const Tickets = require("./ticketsService");

// // login()
// const Schedule = require('./scheduleService')

// async function film() {
//   let arr = [{
//     filmId: 1,
//     cinemaId: 6,
//     schedule: '2021-04-25T09:10:29.000Z',
//     price: 25
//   }]
//   console.log(await Schedule.getAllSchedule())
// }


// film()

// async function ticket() {
//   console.log(await Tickets.getAllTickets({
//     filmId: 3,
//     cinemaId: 13
//   }))
// }
// ticket()

// const Exchange = require('./exchangeService')
// async function exchange() {
//   console.log(await Exchange.filterLoseExchange())
// }
// exchange()

const {
  v4: uuidv4
} = require('uuid');
console.log(uuidv4() + '.12'); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
