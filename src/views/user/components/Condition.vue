<template>
  <div class="condition-container">
    <div class="condition">
      <div class="type">
        <span>类型</span>
        <div class="inner-type">
          <el-tag
            v-for="(t, index) in type"
            :key="index"
            :effect="choosedType == t ? 'dark' : 'plain'"
            @click="filterMovie('type', $event)"
            >{{ t }}</el-tag
          >
        </div>
      </div>
      <el-divider></el-divider>
      <div class="region">
        <span>区域</span>
        <div class="inner-region">
          <el-tag
            v-for="(r, index) in region"
            :effect="choosedRegion == r ? 'dark' : 'plain'"
            :key="index"
            @click="filterMovie('region', $event)"
            >{{ r }}</el-tag
          >
        </div>
      </div>
    </div>
    <div class="filter-movie">
      <el-card
        :body-style="{ padding: '0px' }"
        v-for="(m, i) in movies"
        :key="i"
      >
        <img :src="m.filmImg" class="image" />
        <div style="padding: 14px;" class="title-score">
          <span class="title">{{ m.name }}</span>
          <span class="score">{{ m.score || "无" }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { film } from '@/api'
export default {
  data () {
    return {
      type: [
        '全部',
        '喜剧',
        '动作',
        '奇幻',
        '动画',
        '剧情',
        '悬疑',
        '历史',
        '爱情',
        '科幻',
        '惊悚'
      ],
      region: [
        '全部',
        '大陆',
        '香港',
        '美国',
        '日本',
        '意大利',
        '台湾',
        '英国',
        '印度',
        '韩国',
        '德国',
        '丹麦',
        '瑞典',
        '荷兰',
        '澳大利亚',
        '俄罗斯'
      ],
      filterMovies: {},
      choosedType: '全部',
      choosedRegion: '全部',
      movies: []
    }
  },
  created () {
    this.initFilter(this.filterMovies)
  },
  methods: {
    filterMovie (filter, event) {
      this.filterMovies[filter] = event.target.innerText
      filter == 'type' ? (this.choosedType = this.filterMovies[filter]) : ''
      filter == 'region'
        ? (this.choosedRegion = this.filterMovies[filter])
        : ''
      this.initFilter(this.filterMovies)
    },
    initFilter (filterMovies) {
      filterMovies.type = this.filterMovies.type || '全部'
      filterMovies.region = this.filterMovies.region || '全部'
      film.filterMovie(this.filterMovies).then(res => {
        if (res.code === 0) {
          this.movies = res.data.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.condition-container {
  width: 60%;
  margin: 30px auto;
  .condition {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .region,
    .type {
      position: relative;
      padding-left: 70px;
      > span {
        position: absolute;
        top: 0;
        left: 20px;
        color: #606266;
        width: 70px;
      }
      .inner-region,
      .inner-type {
        .el-tag {
          margin-bottom: 10px;
          margin-right: 10px;
          text-align: center;
          cursor: pointer;
        }
      }
    }
    .el-divider--horizontal {
      margin: 10px 0;
    }
  }
  .filter-movie {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-top: 20px;
    .el-card {
      width: 24%;
      height: 380px;
      margin-bottom: 10px;
      margin-left: 3px;
      margin-right: 3px;
      .image {
        width: 100%;
        height: 320px;
      }
      .title-score {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        .title {
          width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .score {
          width: 20%;
          color: #409eff;
        }
      }
    }
  }
}
</style>
