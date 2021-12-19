<template>
  <div class="schedule">
    <div class="film">
      <div class="tip">
        请选择影片
      </div>
      <el-transfer
        filterable
        filter-placeholder="请输入影片名字"
        v-model="selectedFilm"
        :data="filmList"
        :filter-method="filterFilm"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :titles="['全部影片', '已选影片']"
        @change="selectFilm"
      >
      </el-transfer>
    </div>
    <div class="cinema">
      <div class="tip">
        请选择影院
      </div>
      <el-transfer
        filterable
        filter-placeholder="请输入影院名字"
        v-model="selectedCinema"
        :data="cinemaList"
        :filter-method="filterCinema"
        :props="{
          key: 'id',
          label: 'name'
        }"
        :titles="['全部影院', '已选影院']"
        @change="selectCinema"
      >
      </el-transfer>
    </div>
    <div class="time-price-container">
      <div class="tip">
        请选择排片时间和设定价格
      </div>
      <div class="time-price">
        <el-date-picker
          v-model="datetime"
          type="datetime"
          placeholder="选择日期时间"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
        <div class="price">
          <el-input v-model="price" placeholder="请输入价格"></el-input>
        </div>
      </div>
    </div>
    <div class="goSchedule">
      <el-button type="primary" @click="confirmSchedule">确认排片</el-button>
      <el-button @click="cancelSchedule">取消排片</el-button>
    </div>
  </div>
</template>

<script>
import { film, cinema, schedule } from '@/api'
export default {
  created () {
    this.getFilms()
    this.getCinemas()
  },
  data () {
    return {
      cinemaList: [],
      filmList: [],
      selectedFilm: [],
      selectedCinema: [],
      datetime: '',
      price: '',
      pickerOptions: {
        disabledDate: date => {
          if (
            +new Date(date) <
            +new Date().setHours(0, 0, 0, 0) + 86400000 * 3
          ) {
            return true
          }
          if (new Date(date) > new Date().setHours(0, 0, 0, 0) + 86400000 * 5) {
            return true
          }
        }
      }
    }
  },
  methods: {
    // 得到影片详情
    getFilms () {
      film.getAllFilms().then(res => {
        if (res.code === 0) {
          this.filmList = res.data
        }
      })
    },
    // 得到影院详情
    getCinemas () {
      cinema.getAllCinemas().then(res => {
        if (res.code === 0) {
          this.cinemaList = res.data
        }
      })
    },
    // 搜索影片
    filterFilm (queryWord, item) {
      return item.name.indexOf(queryWord) > -1
    },
    // 搜索影院
    filterCinema (queryWord, item) {
      return item.name.indexOf(queryWord) > -1
    },
    // 选择影片
    selectFilm (value, dir, arr) {},
    // 选择影院
    selectCinema (value, dir, arr) {},
    // 确认排片
    confirmSchedule () {
      const scheduleArr = []
      for (let i = 0; i < this.selectedFilm.length; i++) {
        for (let j = 0; j < this.selectedCinema.length; j++) {
          const scheduleItem = {}
          scheduleItem.filmId = this.selectedFilm[i]
          scheduleItem.cinemaId = this.selectedCinema[j]
          scheduleItem.price = this.price
          scheduleItem.schedule = this.datetime
          scheduleArr.push(scheduleItem)
        }
      }
      schedule.generateSchedule(scheduleArr).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '排片成功！',
            duration: 1000,
            onClose: () => {
              this.$router.push({ name: 'ScheduleManager' })
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    cancelSchedule () {
      this.selectedFilm = []
      this.selectedCinema = []
    }
  }
}
</script>
<style lang="less" scoped>
.schedule {
  width: 80%;
  margin: 20px auto;
  > div {
    margin-bottom: 20px;
    .el-transfer {
      width: 60%;
      margin: 20px auto;
    }
    .tip {
      height: 50px;
      box-sizing: border-box;
      padding: 10px;
      background-color: #545c64;
      color: #dadce0;
    }
  }
  .time-price-container {
    text-align: center;
    .tip {
      margin-bottom: 20px;
    }
    .time-price {
      display: flex;
      justify-content: space-around;
    }
  }
  .goSchedule {
    text-align: center;
  }
}
</style>
