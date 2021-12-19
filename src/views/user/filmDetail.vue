<template>
  <div class="detail">
    <el-image style="width: 200px; height: 350px" :src="filmImg"></el-image>
    <div class="name">
      名称：<span>{{ name }}</span>
    </div>
    <div class="director">
      导演：<span>{{ director }}</span>
    </div>
    <div class="duration">
      时长：<span>{{ duration }}</span>
    </div>
    <div class="introduction">
      简介：<span>{{ introduction }}</span>
    </div>

    <div class="region">
      区域：<span>{{ region }}</span>
    </div>
    <div class="releaseTime">
      放映时间：<span>{{ releaseTime }}</span>
    </div>
    <div class="role">
      角色：
      <span v-for="(r, i) in role" :key="i">{{ r }} | </span>
    </div>
    <div class="score">
      评分：<span>{{ score }}</span>
    </div>
    <div class="type">
      类型：<span>{{ type }}</span>
    </div>
  </div>
</template>

<script>
import { film } from '@/api'
export default {
  created () {
    const { filmId } = this.$route.params
    this.getDetail(filmId)
  },
  data () {
    return {
      director: '',
      duration: '',
      filmImg: '',
      introduction: '',
      name: '',
      region: '',
      releaseTime: '',
      role: [],
      score: 0,
      type: ''
    }
  },
  methods: {
    async getDetail (id) {
      const result = await film.getDetail(id)
      if (result.code === 0) {
        const filmDetail = result.data
        this.director = filmDetail.director
        this.duration = filmDetail.duration
        this.filmImg = filmDetail.filmImg
        this.introduction = filmDetail.introduction
        this.name = filmDetail.name
        this.region = filmDetail.region
        this.releaseTime = filmDetail.releaseTime
        this.role = JSON.parse(filmDetail.role)
        this.score = filmDetail.score
        this.type = filmDetail.type
      }
    }
  }
}
</script>
<style lang="less" scoped>
.detail {
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  font-size: 16px;
  line-height: 1.5;
  div {
    span {
      color: #409eff;
    }
  }
  .el-image {
    float: left;
    margin-right: 20px;
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }
}
</style>
