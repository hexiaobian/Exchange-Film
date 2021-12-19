<template>
  <div class="search-word">
    <el-card
      :body-style="{ padding: '0px' }"
      shadow="hover"
      v-for="(movie, index) in movies"
      :key="index"
    >
      <img
        :src="movie.filmImg"
        class="image"
        :style="{ width: '40%', height: '300px' }"
      />
      <div class="brief" :style="{ float: 'right', width: '60%' }">
        <div class="title">{{ movie.name }}</div>
        <div class="rate">评分：{{ movie.score }}</div>
        <div class="duration">时长：{{ movie.duration }}</div>
      </div>
      <el-divider content-position="left"
        >上映时间：{{ movie.releaseTime }}</el-divider
      >
    </el-card>
  </div>
</template>

<script>
import { film } from '@/api'

export default {
  data () {
    return {
      keyWords: '',
      movies: []
    }
  },
  created () {
    this.keyWords = this.$route.query.kw
    this.searchMovies()
  },
  watch: {
    $route (to, from) {
      this.keyWords = to.query.kw
      this.searchMovies()
    }
  },
  methods: {
    searchMovies () {
      film.searchMovies(this.keyWords).then(res => {
        if (res.code === 0) {
          this.movies = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search-word {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 60%;
  margin: 0 auto;
  .el-card {
    width: 48%;
    margin-top: 30px;
    .brief {
      box-sizing: border-box;
      padding: 10px;
      font-size: 20px;
      .title {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 30px;
        line-height: 2;
        color: #409eff;
      }
    }
  }
}
</style>
