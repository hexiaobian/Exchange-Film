import axios from '../axios'

// 用户
const user = {
  // 分页查询用户信息
  queryByPage: function (data) {
    return axios({
      method: 'get',
      url: '/user',
      params: data
    })
  },
  // 获取用户信息（id、account）
  findUserById(id) {
    return axios({
      method: 'get',
      url: '/user/info',
      params: {
        id
      }
    })
  },
  // 检查用户是否存在
  checkUser: function (data) {
    return axios({
      method: 'get',
      url: '/user/checkUser',
      params: {
        account: data
      }
    })
  },
  // 登录
  login: function (data) {
    // 发送 POST 请求
    return axios({
      method: 'post',
      url: '/user/login',
      data
    })
  },
  // 注册
  register: function (data) {
    return axios({
      method: 'post',
      url: '/user/register',
      data
    })
  }

}
// 电影
const film = {
  // 获取电影详情
  getDetail: function (id) {
    return axios({
      method: 'get',
      url: '/film/filmId',
      params: {
        id
      }
    })
  },
  // 分类获取电影
  getHinting: function (data) {
    return axios({
      method: 'get',
      url: '/film/category',
      params: data
    })
  },
  // 输入搜索词获取电影
  searchMovies: function (data) {
    return axios({
      method: 'get',
      url: '/film/search',
      params: {
        keyWords: data
      }
    })
  },
  // 过滤电影
  filterMovie: function (data) {
    return axios({
      method: 'get',
      url: '/film/condition',
      params: data
    })
  },
  // 分页查找
  findByPage: function (data) {
    return axios({
      method: 'get',
      url: '/film',
      params: data
    })
  },
  // 更新影片数据
  updateFilm: function (filmObj) {
    return axios({
      method: 'put',
      url: '/film',
      data: {
        filmObj
      }
    })
  },
  // 添加影片数据
  addFilm: function (filmObj) {
    return axios({
      method: 'post',
      url: '/film',
      data: {
        filmObj
      }
    })
  },
  // 删除影片数据
  deleteFilm: function (filmId) {
    return axios({
      method: 'delete',
      url: '/film',
      data: {
        filmId
      }
    })
  },
  // 得到所有影票的id和名字
  getAllFilms: function () {
    return axios({
      method: 'get',
      url: '/film/all'
    })
  }

}

// 排片
const schedule = {
  // 获取排片数据
  getSchedule: function (id) {
    return axios({
      method: 'get',
      url: '/schedule/schedule',
      params: {
        scheduleId: id
      }
    })
  },
  // 获取影院数据
  getCinema: function (id) {
    return axios({
      method: 'get',
      url: '/schedule/selectBuy',
      params: {
        filmId: id
      }
    })
  },
  // 获取影片数据
  getFilm: function (id) {
    return axios({
      method: 'get',
      url: '/schedule/selectBuy',
      params: {
        cinemaId: id
      }
    })
  },
  // 生成排片数据
  generateSchedule: function (scheduleArr) {
    return axios({
      method: 'post',
      url: '/schedule',
      data: {
        scheduleArr
      }
    })
  },
  // 分页获取排片数据
  findBySearch: function (data) {
    return axios({
      method: 'get',
      url: '/schedule',
      params: data
    })
  },
  // 更新排片信息
  updateSchedule: function (data) {
    return axios({
      method: 'put',
      url: '/schedule',
      data
    })
  },
  // 删除排片情况
  deleteSchedule: function (id) {
    return axios({
      method: 'delete',
      url: '/schedule',
      data: {
        id
      }
    })
  }
}

// 影院
const cinema = {
  // 获取影院详情
  getCinemaDetail(id) {
    return axios({
      method: 'get',
      url: '/cinema/cinemaId',
      params: {
        cinemaId: id
      }
    })
  },
  // 获取影院所有数据(id和名字)
  getAllCinemas: function () {
    return axios({
      method: 'get',
      url: '/cinema/all'
    })
  },
  // 添加影院数据
  addCinema(data) {
    return axios({
      method: 'post',
      url: '/cinema',
      data: {
        cinemaObj: data
      }
    })
  },
  // 更新影院数据
  updateCinema(data) {
    return axios({
      method: 'put',
      url: '/cinema/cinemaId=' + data.id,
      data
    })
  },

  // 删除影院数据
  deleteCinema(id) {
    return axios({
      method: 'delete',
      url: '/cinema/cinemaId=' + id,
      data: {
        cinemaId: id
      }
    })
  },
  // 分页获取影院数据
  queryByPage(data) {
    return axios({
      method: 'get',
      url: '/cinema',
      params: data
    })
  }
}

// 影票
const tickets = {
  // 生成影票
  generateTickets(obj) {
    return axios({
      method: 'post',
      url: '/tickets/buy',
      data: obj
    })
  },
  // 获取所有影票
  getAllTickets(obj) {
    return axios({
      method: 'get',
      url: '/tickets/exist',
      params: obj
    })
  },
  // 通过影票id获取所有的影票信息
  async getTicketbyId(id) {
    return axios({
      method: 'get',
      url: '/tickets/' + id
    })
  },
  // 更新影票信息
  async updateTicket(id, ticketObj) {
    return axios({
      method: 'put',
      url: '/tickets/update',
      data: {
        id,
        ticketObj
      }
    })
  },
  // 删除影票信息
  async destoryTicket(id, orderId) {
    return axios({
      method: 'delete',
      url: '/tickets',
      data: {
        id,
        orderId
      }
    })
  }
}

// 订单
const order = {
  // 生成订单
  generateOrder(obj) {
    return axios({
      method: 'post',
      url: '/order/add',
      data: obj
    })
  },
  // 得到某个用户的所有订单
  getOrderByUserId(id) {
    return axios({
      method: 'get',
      url: '/order/find',
      params: {
        userId: id
      }
    })
  },
  // 更新订单信息
  updateOrder(id, orderObj) {
    return axios({
      method: 'put',
      url: '/order/update',
      data: {
        id,
        orderObj
      }
    })
  },
  // 分页获取所有的订单信息
  getAllOrder(data) {
    return axios({
      method: 'get',
      url: '/order',
      params: data
    })
  }

}

// 换票
const exchange = {
  // 生成换票信息
  saleTicket(data) {
    return axios({
      method: 'post',
      url: '/exchange/saleTicket',
      data: {
        exchangeObj: data
      }
    })
  },
  // 查询某个用户的所有换票信息，不包含已被交易的记录
  judgeByUserId(userId) {
    return axios({
      method: 'get',
      url: '/exchange/judgeByUserId',
      params: {
        userId
      }
    })
  },
  // 查询某个用户所有的换票记录
  selectUserAll(userId) {
    return axios({
      method: 'get',
      url: '/exchange/selectUserAll',
      params: {
        userId
      }
    })
  },
  // 获取所有的换票信息
  selectAll() {
    return axios({
      method: 'get',
      url: '/exchange/selectAll'
    })
  },
  // 过滤已换的换票信息
  filterExchange() {
    return axios({
      method: 'get',
      url: '/exchange/filterExchange'
    })
  },
  // 删除某条换票信息
  deleteExchange(ticketId) {
    return axios({
      method: 'delete',
      url: '/exchange/deleteExchange',
      params: {
        ticketId
      }
    })
  },
  // 更改换票记录中的目标用户Id，换票交易成功
  saleExchange(originObj, targetObj, balance) {
    return axios({
      method: 'put',
      url: '/exchange/saleExchange',
      data: {
        originObj,
        targetObj,
        balance
      }
    })
  }
}

// 管理员
const manager = {
  login(data) {
    return axios({
      method: 'post',
      url: '/manager/login',
      data
    })
  }
}

export {
  user,
  film,
  schedule,
  cinema,
  tickets,
  order,
  exchange,
  manager
}
