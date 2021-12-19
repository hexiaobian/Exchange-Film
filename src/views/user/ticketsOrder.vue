<template>
  <div class="order-container">
    <div class="tip">您所购买的电影票</div>
    <div class="order">
      <div class="info" v-for="(s, i) in seat" :key="i">
        <div class="movie-name">{{ movieName }}</div>
        <div class="cinema-name">{{ cinemaName }}</div>
        <div class="seat">
          座位号：<span>{{ `${s[0]}排${s[1]}列` }}</span>
        </div>
        <div class="price">{{ price }}元</div>
        <div class="showtime">
          上映时间：<span>{{ showtime }}</span>
        </div>
      </div>
    </div>
    <div class="buy">
      <div class="totalprice">{{ price * ticketsLen }}元</div>
      <div class="unit">共{{ ticketsLen }}张</div>
      <el-button type="primary" @click="generateTicket">支付</el-button>
    </div>
  </div>
</template>

<script>
import { tickets, film, cinema, order } from '@/api'
import moment from 'moment'
export default {
  created () {
    this.ticketsInfo = this.$route.params.obj
    this.init(this.ticketsInfo)
    this.getFilm(this.ticketsInfo.filmId)
    this.getCinema(this.ticketsInfo.cinemaId)
  },
  data () {
    return {
      ticketsInfo: {},
      movieName: '',
      cinemaName: '',
      ticketsLen: 0,
      price: 0,
      seat: []
    }
  },
  methods: {
    // 初始化
    init (obj) {
      const { seat, price, showtime, ...ticket } = obj
      this.price = price
      this.seat = seat
      this.ticketsLen = seat.length
      this.showtime = moment(showtime).format('YYYY-MM-DD HH:mm:ss')
    },
    // 生成影票
    async generateTicket () {
      const userId = this.$store.state.userInfo.id
      const { seat, ...ticket } = this.ticketsInfo
      const allTickets = []
      for (let i = 0; i < seat.length; i++) {
        const temp = { ...ticket }
        temp.seat = JSON.stringify(seat[i])
        temp.userId = userId
        allTickets.push(temp)
      }
      let result = null
      if (this.$route.meta.name === 'exchangeRegion') {
        result = await exchange.saleExchange(
          idInfo.exchangeId,
          this.$store.state.userInfo.id
        )
      } else {
        result = await tickets.generateTickets(allTickets)
      }
      if (result.code == 0) {
        const r = result.data
        const params = {
          userId: this.$store.state.userInfo.id,
          ticketsIds: JSON.stringify(r.map(t => t.id)),
          filmName: this.movieName,
          cinemaName: this.cinemaName,
          dealTime: moment(r[0].createdAt).format('YYYY-MM-DD HH:mm:ss'),
          dealprice: this.price * this.ticketsLen
        }
        const res = await order.generateOrder(params)
        if (res.code === 0) {
          this.$message({
            message: '支付成功',
            type: 'success',
            duration: 1000,
            onClose: () => {
              this.$router.push({
                path: '/personal'
              })
            }
          })
        }
      }
    },
    // 得到影片名
    getFilm (id) {
      film.getDetail(id).then(res => {
        if (res.code == 0) {
          this.movieName = res.data.name
        }
      })
    },
    // 得到影院名
    getCinema (id) {
      cinema.getCinemaDetail(id).then(res => {
        if (res.code == 0) {
          this.cinemaName = res.data.name
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.order-container {
  width: 70%;
  margin: 20px auto;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .tip {
    width: 100%;
    height: 50px;
    text-align: center;
    color: #409eff;
  }
  .order {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    color: #303133;
    font-size: 14px;
    .info {
      position: relative;
      width: 45%;
      height: 150px;
      padding-top: 10px;
      padding-left: 10px;
      margin-bottom: 20px;
      border: 1px solid #409eff;
      background-image: linear-gradient(90deg, #409eff, #79bbff);
      background-size: 100% 10px;
      background-repeat: no-repeat;
      line-height: 1.5;
      .movie-name {
        color: #409eff;
        font-size: 20px;
      }
      .cinema-name {
        color: #909399;
        font-size: 10px;
        margin-bottom: 35px;
      }
      .price {
        position: absolute;
        right: 15px;
        top: 16px;
        color: #409eff;
      }
      .showtime,
      .seat {
        span {
          color: #79bbff;
        }
      }
    }
  }
  .buy {
    position: relative;
    width: 100%;
    height: 45px;
    margin-top: 30px;
    .totalprice {
      color: #409eff;
      font-size: 20px;
    }
    .unit {
      padding-left: 10px;
      color: #909399;
      font-size: 6px;
    }
    .el-button {
      position: absolute;
      right: 10px;
      top: 10px;
      padding: 5px 10px;
    }
  }
}
</style>
