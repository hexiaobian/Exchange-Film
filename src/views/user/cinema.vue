<template>
  <div class="cinema-detail">
    <div class="cinema">
      <div class="name">{{ cinema.name }}</div>
      <div class="location">{{ cinema.location }}</div>
    </div>
    <div class="movie-list">
      <div
        class="movie-item"
        v-for="m in movies"
        :key="m.id"
        :class="{ clickClass: m.id === current }"
        @click="getMovieDetail(m.id)"
      >
        <img :src="m.filmImg" class="img" />
        <span class="el-icon-caret-top" v-if="m.id == current"></span>
      </div>
    </div>
    <div class="movie-detail">
      <div class="name">{{ info.name }}</div>
      <div class="detail-info">
        <span>
          {{ info.type }} | {{ info.duration }} | {{ info.region }} |
          {{ info.releaseTime }} | {{ info.score }}</span
        >
      </div>
    </div>
    <div class="schedule">
      <div class="time-loc">
        <div>
          <el-tabs type="card" v-model="activeDay" @tab-click="handleClick">
            <el-tab-pane
              v-for="(a, i) in arrange"
              :key="i"
              :label="a.label"
              :name="a.name"
            >
              <schedules
                v-if="activeDay === 'today'"
                :currentSchedule="currently"
                @goToBuy="goToBuy"
              />
              <schedules
                v-else-if="activeDay === 'tomorrow'"
                :currentSchedule="currently"
                @goToBuy="goToBuy"
              />
              <schedules
                v-else
                :currentSchedule="currently"
                @goToBuy="goToBuy"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cinema, schedule, film } from '@/api'
import Schedules from '@/views/user/components/Schedules.vue'
export default {
  components: {
    Schedules
  },
  data () {
    return {
      movies: [],
      cinema: {},
      schedule: [],
      currentSchedule: [],
      current: 0,
      info: {},
      activeDay: 'today',
      arrange: [
        { label: '今天', name: 'today' },
        { label: '明天', name: 'tomorrow' },
        { label: '后天', name: 'aftertomorrow' }
      ],
      currently: []
    }
  },
  created () {
    const id = this.$route.query.cinemaId
    this.getFilms(id)
    this.getCinema(id)
  },
  methods: {
    // 得到电影列表
    getFilms (id) {
      schedule.getFilm(id).then(res => {
        if (res.code == 0) {
          const mIds = []
          this.schedules = res.data.schedule
          this.movies = res.data.films.filter(m => {
            if (!mIds.includes(m.id)) {
              mIds.push(m.id)
              return m
            }
          })
          this.current = this.movies[0].id
          this.getMovieDetail(this.current)
        }
      })
    },
    // 得到影院详情
    getCinema (id) {
      cinema.getCinemaDetail(id).then(res => {
        if (res.code == 0) {
          this.cinema = res.data
        }
      })
    },
    // 得到影片详情
    getMovieDetail (id) {
      this.activeDay = 'today'
      this.current = id
      this.info = this.movies.filter(m => m.id === id)[0]
      this.getSchedule(id)
    },
    // 得到排片情况
    getSchedule (id) {
      const moment = require('moment')
      const currentSchedule = JSON.parse(
        JSON.stringify(this.schedules.filter(s => s.filmId == id))
      )
      function format (num) {
        return num >= 10 ? num : '0' + num
      }
      this.currentSchedule = currentSchedule.map(c => {
        c.showTime = {}
        if (
          +new Date(c.schedule) - new Date().setHours(0, 0, 0, 0) <
          24 * 60 * 60 * 1000
        ) {
          c.showTime.time =
            format(new Date(c.schedule).getHours()) +
            ':' +
            format(new Date(c.schedule).getMinutes())
          c.showTime.day = 'today'
        } else if (
          +new Date(c.schedule) - new Date().setHours(0, 0, 0, 0) <
          24 * 60 * 60 * 1000 * 2
        ) {
          c.showTime.time =
            format(new Date(c.schedule).getHours()) +
            ':' +
            format(new Date(c.schedule).getMinutes())
          c.showTime.day = 'tomorrow'
        } else {
          c.showTime.time =
            format(new Date(c.schedule).getHours()) +
            ':' +
            format(new Date(c.schedule).getMinutes())
          c.showTime.day = 'aftertomorrow'
        }
        // const year = format(moment(c.schedule).get("year"));
        // const month = format(moment(c.schedule).get("month") + 1);
        // const date = format(moment(c.schedule).get("date"));
        // const hour = format(moment(c.schedule).get("hour"));
        // const minute = format(moment(c.schedule).get("minute"));
        // c.schedule = (
        //   year +
        //   "-" +
        //   month +
        //   "-" +
        //   date +
        //   " " +
        //   hour +
        //   ":" +
        //   minute
        // ).split(" ");
        return c
      })
      this.currently = this.currentSchedule.filter(
        c => c.showTime.day === 'today'
      )
    },
    goToBuy (id) {
      this.$router.push({ path: '/chooseSeat', query: { scheduleId: id } })
    },
    handleClick (tab, e) {
      this.activeDay = tab.name
      this.currently = this.currentSchedule.filter(
        c => c.showTime.day === this.activeDay
      )
    }
  }
}
</script>

<style lang="less" scoped>
.cinema-detail {
  width: 76%;
  margin: 0 auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .cinema {
    box-sizing: border-box;
    padding: 10px 20px;
    width: 100%;
    height: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    background-color: #f2f6fc;
    .name {
      color: #409eff;
      font-size: 20px;
      margin-bottom: 16px;
    }
    .location {
      font-size: 12px;
      color: #909399;
    }
  }
  .movie-list {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    height: 230px;
    padding: 10px 10px;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1px solid #ebeef5;
    &::-webkit-scrollbar {
      width: 0 !important;
    }
    .movie-item.clickClass {
      transform: scale(1.2);
      opacity: 1;
    }
    .movie-item {
      width: 120px;
      height: 200px;
      margin-right: 10px;
      flex-shrink: 0;
      text-align: center;
      opacity: 0.5;
      transition: all 0.5s;
      .img {
        width: 100%;
        height: 90%;
      }
      .el-icon-caret-top {
        color: #409eff;
        font-size: 20px;
      }
    }
  }
  .movie-detail {
    width: 100%;
    height: 80px;
    margin: 10px 0;
    text-align: center;
    line-height: 1.5;
    border-bottom: 1px solid #ebeef5;
    .name {
      color: #409eff;
      font-size: 20px;
    }
  }
}
</style>
