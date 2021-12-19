<template>
  <div class="recommands">
    <el-card
      :key="index"
      :body-style="{
        padding: '0px',
        height: '380px'
      }"
      v-for="(recommand, index) in movies"
      @click.native="getDetail(recommand.id)"
    >
      <el-image :src="recommand.filmImg" style="height: 320px" fit="fill" />
      <div style="padding: 14px;">
        <span class="movie-title">{{ recommand.name }}</span>
        <div class="bottom clearfix"></div>
      </div>
    </el-card>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
import { film } from '@/api'

export default {
  // 初始化获取电影数据
  created () {
    this.type = this.$route.meta.type
    this.getHinting()
  },
  data () {
    return {
      type: '',
      currentPage: 1,
      size: 10,
      movies: [],
      total: 0
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
    // 分页获取
    changePage (page) {
      this.currentPage = page
      this.getHinting()
    },
    // 获取影片详情
    getDetail (id) {
      this.$router.push({
        name: 'FilmDetail',
        params: {
          filmId: id
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-main > .recommands {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 50px;
  .el-card {
    width: 18%;
    margin-bottom: 20px;
    margin-right: 20px;
    cursor: pointer;
    text-align: center;
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
  .el-pagination {
    display: block;
    width: 100%;
    text-align: right;
  }
}
</style>
