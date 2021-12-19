<template>
  <div class="hinting">
    <el-card
      :key="index"
      :body-style="{
        padding: '0px',
        height: '480px'
      }"
      v-for="(hinting, index) in movies"
      @click.native="goToDetail(hinting.id)"
    >
      <el-image :src="hinting.filmImg" style="height: 350px" fit="fill" />
      <div style="padding: 14px;">
        <span class="movie-title">{{ hinting.name }}</span>
        <div class="bottom clearfix">
          <el-button
            type="primary"
            v-if="type == 'hinting'"
            :style="{ marginTop: '20px' }"
            @click.stop="goToBuy(hinting.id)"
            >购票选座</el-button
          >
          <el-button
            type="success"
            v-else
            :style="{ marginTop: '20px' }"
            @click="goToReserve(hinting.id)"
            >预售</el-button
          >
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { film } from '@/api'

export default {
  // 初始化获取数据
  created () {
    this.type = this.$route.meta.type
    this.getHinting()
  },
  // watch: {
  //   $route(to) {
  //     this.type = to.params.category;
  //     this.getHinting();
  //   },
  //   immediate: true
  // },
  // 路由的变化来得到不同的电影类型数据
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.type = to.meta.type
      vm.getHinting()
    })
  },

  data () {
    return {
      currentPage: 1,
      size: 10,
      type: 'hinting',
      movies: []
    }
  },

  methods: {
    // 获取电影数据
    getHinting () {
      const params = {
        page: this.currentPage,
        size: this.size,
        category: this.type
      }
      film.getHinting(params).then(res => {
        if (res.code === 0) {
          this.total = res.data.count
          this.movies = res.data.data
        }
      })
    },
    // 获取某个电影的详情并购票
    goToBuy (id) {
      const { userInfo } = this.$store.state
      if (userInfo == null) {
        this.$router.push({ name: 'Login' })
      } else {
        this.$router.push({ path: '/selectBuy', query: { filmId: id } })
      }
    },
    // 获取电影详情
    goToDetail (id) {
      this.$router.push({ name: 'FilmDetail', params: { filmId: id } })
    }
  }
}
</script>

<style lang="less" scoped>
.el-main > .hinting {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 50px;
  .el-card {
    width: 18%;
    margin-bottom: 20px;
    margin-right: 20px;
    text-align: center;
    cursor: pointer;
    .el-card__body {
      width: 100%;
      .movie-title {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
