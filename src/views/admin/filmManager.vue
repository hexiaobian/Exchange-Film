<template>
  <div class="film">
    <el-table
      :data="filmData"
      style="width: 100%"
      border
      :show-overflow-tooltip="true"
    >
      <el-table-column prop="id" label="影片id" width="80"> </el-table-column>
      <el-table-column
        prop="name"
        label="影名"
        width="180"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="duration" label="时长" width="100">
      </el-table-column>
      <el-table-column
        prop="director"
        label="导演"
        width="80"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="region" label="区域" width="200"></el-table-column>

      <el-table-column
        prop="filmImg"
        label="海报图片地址"
        width="200"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="releaseTime" label="上映时间" width="260">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="80"> </el-table-column>
      <el-table-column
        prop="role"
        label="角色"
        width="300"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column prop="score" label="评分" width="80"> </el-table-column>
      <el-table-column
        prop="category"
        label="类别"
        width="120"
        :filters="filterArr"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editFilm(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteFilm(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="getMore"
    >
    </el-pagination>
  </div>
</template>

<script>
import { film } from '@/api'
export default {
  created () {
    this.getFilmData()
  },
  data () {
    return {
      filmData: [],
      currentPage: 1,
      size: 10,
      total: 0,
      filterArr: [
        { text: '正在热映', value: '正在热映' },
        { text: '即将上映', value: '即将上映' },
        { text: '热点推荐', value: '热点推荐' }
      ]
    }
  },
  methods: {
    // 获取全部影院数据
    getFilmData () {
      const params = {
        page: this.currentPage,
        size: this.size
      }
      film.findByPage(params).then(res => {
        if (res.code === 0) {
          this.filmData = JSON.parse(JSON.stringify(res.data.data)).map(f => {
            f.role = JSON.parse(f.role).join('，')
            f.category =
              f.category === 'hinting'
                ? '正在热映'
                : f.category === 'upcoming'
                  ? '即将上映'
                  : '热点推荐'
            return f
          })
          this.total = res.data.count
        }
      })
    },
    // 点击切换页面获取更多数据
    getMore (page) {
      this.currentPage = page
      this.getFilmData()
    },
    // 跳转到电影详情页
    editFilm (row) {
      this.$router.push({
        path: '/filmManager/editFilm',
        query: { filmId: row.id }
      })
    },
    // 过滤数据
    filterTag (value, row) {
      return row.category === value
    },
    // 删除某个影片
    deleteFilm (row) {
      this.$confirm(
        `此操作将删除<strong>${row.name}</strong>的相关数据, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          film.deleteFilm(row.id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000,
                onClose: () => {
                  this.getFilmData()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
