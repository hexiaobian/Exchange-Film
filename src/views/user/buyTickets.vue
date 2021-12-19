<template>
  <div class="buy-ticket">
    <div class="info">
      <div class="movie-name">
        {{ movie.name }}
      </div>
      <div class="cinema-name">
        {{ cinema.name }}
      </div>
      <div class="price">{{ price }}元</div>
    </div>
    <div class="seat">
      <div class="tip">选座位</div>
      <div class="screen">屏幕</div>
      <div class="seat-list">
        <div class="seat-row" v-for="(row, index) in seatList" :key="index">
          <el-tag
            v-for="(col, cIndex) in row"
            :key="cIndex"
            :effect="isSelected(col) ? 'dark' : 'light'"
            @click="selectSeats(col, $event)"
          ></el-tag>
        </div>
      </div>
    </div>
    <div class="selected-seat" v-if="checkedSeats.length > 0">
      已选择
      <span
        class="selected-item"
        v-for="(s, index) in checkedSeats"
        :key="index"
      >
        {{ s[0] + "排" + s[1] + "列" }}
      </span>
    </div>
    <div class="buy">
      <div class="num">已选择{{ checkedSeats.length }}张</div>
      <div class="price">￥{{ price * checkedSeats.length }}</div>
      <div class="buy-button">
        <el-button type="primary" @click="goToBuy">购票</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { cinema, schedule, film, tickets } from '@/api'
import moment from 'moment'
export default {
  created () {
    const id = this.$route.query.scheduleId
    this.getSchedule(id)
    this.generateSeat()
  },
  data () {
    return {
      cinema: {},
      movie: {},
      price: 0,
      schedule: '',
      seatList: {},
      checkedSeats: [],
      allCheckedSeats: [],
      filmId: '',
      cinemaId: '',
      showtime: ''
    }
  },
  methods: {
    // 获取排片情况
    getSchedule (id) {
      schedule.getSchedule(id).then(res => {
        if (res.code == 0) {
          const { cinemaId, filmId, schedule, price } = res.data
          this.cinemaId = cinemaId
          this.filmId = filmId
          this.showtime = schedule
          const time =
            moment(schedule).get('hours') +
            ':' +
            moment(schedule).get('minutes')
          this.schedule = time
          this.price = price
          this.getCinema(cinemaId)
          this.getFilm(filmId)
          this.getBoughtTickets()
        }
      })
    },
    // 获取影院数据
    getCinema (id) {
      cinema.getCinemaDetail(id).then(res => {
        if (res.code == 0) {
          this.cinema = res.data
        }
      })
    },
    // 获取电影数据
    getFilm (id) {
      film.getDetail(id).then(res => {
        if (res.code == 0) {
          this.movie = res.data
        }
      })
    },
    // 获得已被购买的电影票对应的座位表
    getBoughtTickets () {
      const params = {
        filmId: this.filmId,
        cinemaId: this.cinemaId,
        showtime: this.showtime
      }
      tickets.getAllTickets(params).then(res => {
        if (res.code == 0) {
          const allChecked = res.data
          this.allCheckedSeats = allChecked.map(a => JSON.parse(a.seat))
        }
      })
    },
    // 生成座位表
    generateSeat () {
      const seats = {}
      for (let i = 1; i <= 9; i++) {
        seats[i] = []
        for (let j = 1; j <= 15; j++) {
          seats[i].push([i, j])
        }
      }
      this.seatList = seats
    },
    // 选座
    selectSeats (seat, event) {
      if (this.allCheckedSeats.includes(seat)) {
        this.$message({
          type: 'error',
          message: '此座位不可选！'
        })
      }
      const isSelectedIndex = this.checkedSeats.findIndex(
        selected => selected == seat
      )

      if (isSelectedIndex > -1) {
        this.checkedSeats.splice(isSelectedIndex, 1)
      } else {
        this.checkedSeats.push(seat)
      }
    },
    // 判断座位号是否已选
    isSelected (seat) {
      return (
        this.allCheckedSeats.find(e => e.toString() == seat.toString()) ||
        this.checkedSeats.includes(seat)
      )
    },
    // 跳转到购票页面
    goToBuy () {
      if (this.checkedSeats.length == 0) {
        this.$message({
          message: '您未选座，不能进行购票操作!',
          type: 'error'
        })
        return
      }
      const params = {
        filmId: this.filmId,
        cinemaId: this.cinemaId,
        showtime: this.showtime,
        seat: this.checkedSeats,
        price: this.price
      }
      this.$router.push({
        name: 'TicketsOrder',
        params: {
          obj: params
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.buy-ticket {
  width: 70%;
  margin: 0 auto;
  .info {
    position: relative;
    height: 70px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background-color: #f2f6fc;
    padding: 10px 20px;
    .movie-name {
      color: #409eff;
      font-size: 20px;
      margin-bottom: 15px;
    }
    .cinema-name {
      color: #909399;
      font-size: 12px;
    }
    .price {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 14px;
      color: #409eff;
    }
  }
  .seat {
    width: 80%;
    margin: 30px auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .tip {
      height: 50px;
      text-align: center;
      font-size: 16px;
      line-height: 2;
    }
    .screen {
      height: 20px;
      text-align: center;
      font-size: 8px;
      color: #dcdfe6;
    }
    .seat-list {
      padding: 10px 0 20px;
      text-align: center;
      .seat-row {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: nowrap;
        padding-left: 10px;
        padding-right: 10px;
        .el-tag {
          width: 25px;
          height: 25px;
          margin-bottom: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .selected-seat {
    width: 80%;
    height: 100px;
    box-sizing: border-box;
    padding: 20px;
    margin: 30px auto;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .selected-item {
      color: #409eff;
    }
  }
  .buy {
    position: fixed;
    left: 200px;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 47%;
    height: 80px;
    box-sizing: border-box;
    padding: 20px;
    background-color: #f2f6fc;
    border: 1px solid #c0c4cc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .num {
      margin-bottom: 5px;
      font-size: 18px;
      color: #606266;
    }
    .price {
      font-size: 16px;
      color: #409eff;
    }
    .buy-button {
      position: absolute;
      right: 20px;
      top: 40%;
      .el-button {
        padding: 5px 8px;
      }
    }
  }
}
</style>
