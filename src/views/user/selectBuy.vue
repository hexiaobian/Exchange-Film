<template>
  <div class="select-buy">
    <div class="movie-detail">
      <img :src="movie.filmImg" class="bg" />
      <img :src="movie.filmImg" class="img" />
      <div class="detail">
        <div class="title">
          电影名： <span>{{ movie.name }}</span>
        </div>
        <div class="director">
          导演： <span>{{ movie.director }}</span>
        </div>
        <div class="role">
          角色：
          <span v-for="(r, index) in role" :key="index">{{ r }} </span>
        </div>
        <div class="duration">
          时长： <span>{{ movie.duration }}</span>
        </div>
        <div class="type">
          类型：<span>{{ movie.type }}</span>
        </div>
        <div class="showtime">
          上映时间：<span>{{ movie.releaseTime }}</span>
        </div>
        <div class="introduction">
          简介：<span>{{ movie.introduction }}</span>
        </div>
      </div>
    </div>
    <div class="cinema-list">
      <el-divider content-position="left">
        <el-select
          v-model="value"
          placeholder="请选择城市"
          @change="filterCity"
        >
          <el-option v-for="(city, index) in citys" :key="index" :value="city">
          </el-option>
        </el-select>
      </el-divider>
      <div
        class="cinema-item"
        v-for="(cinema, index) in filterCinemas"
        :key="index"
        @click="getToCinema(cinema.id)"
      >
        <div class="name">
          {{ cinema.name }}
        </div>
        <div class="location">{{ cinema.location }}</div>
        <div class="price">{{ cinema.price }}元起</div>
        <el-divider></el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { film, schedule } from '@/api'
export default {
  data () {
    return {
      movie: {},
      role: [],
      cinemas: [],
      citys: [],
      value: '',
      filterCinemas: []
    }
  },
  created () {
    this.getCinema(this.$route.query.filmId)
    this.getMovieDetail(this.$route.query.filmId)
  },
  methods: {
    // 获取电影所对应的所有影院详情
    getCinema (id) {
      schedule.getCinema(id).then(res => {
        if (res.code == 0) {
          this.cinemas = res.data.cinemas
          const schedule = res.data.schedule
          this.citys = [...new Set(this.cinemas.map(c => c.city))]
          this.citys.unshift('全部')
          this.cinemas.forEach((c, index) => {
            schedule.forEach(s => {
              if (c.id === s.cinemaId) {
                this.cinemas[index].schedule = s.schedule
                this.cinemas[index].price = s.price
              }
            })
          })
          this.filterCinemas = this.cinemas
        }
      })
    },
    // 获取单部电影详情
    getMovieDetail (id) {
      film.getDetail(id).then(res => {
        if (res.code == 0) {
          this.movie = res.data
          this.role = JSON.parse(this.movie.role)
        }
      })
    },
    // 筛选城市所在影院
    filterCity (value) {
      if (value === '全部') {
        this.filterCinemas = this.cinemas
      } else {
        this.filterCinemas = this.cinemas.filter(c => c.city === value)
      }
    },
    // 跳转到某个影院首页
    getToCinema (id) {
      this.$router.push({ path: '/cinema', query: { cinemaId: id } })
    }
  }
}
</script>
<style lang="less" scoped>
.movie-detail {
  position: relative;
  box-sizing: border-box;
  padding: 10px 20px 10px 250px;
  width: 100%;
  height: 320px;
  overflow: hidden;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    -webkit-filter: blur(5px);
    filter: blur(15px);
    transform: scale(1.2);
  }
  .img {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 200px;
  }
  .detail {
    line-height: 2;
    font-size: 16px;
    span {
      color: #409eff;
    }
    .role {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .introduction {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.cinema-list {
  > .el-divider--horizontal {
    margin-top: 35px;
  }
  .cinema-item {
    position: relative;
    width: 100%;
    height: 70px;
    line-height: 1.5;
    padding: 10px 0;
    cursor: pointer;
    .name {
      margin-left: 20px;
      box-sizing: border-box;
      color: #409eff;
      font-size: 20px;
    }
    .location {
      margin-left: 20px;
      margin-top: 10px;
      box-sizing: border-box;
      color: #909399;
      font-size: 12px;
    }
    .price {
      position: absolute;
      right: 20px;
      top: 30px;
      color: #409eff;
      font-size: 16px;
    }
  }
}
</style>
