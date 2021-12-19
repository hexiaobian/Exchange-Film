<template>
  <div class="cinema">
    <el-table :data="cinemaData" style="width: 100%">
      <el-table-column prop="id" label="影院id" width="180"> </el-table-column>
      <el-table-column prop="name" label="影院名" width="180">
      </el-table-column>
      <el-table-column prop="location" label="所处位置" width="180">
      </el-table-column>
      <el-table-column prop="netTime" label="入网时间"> </el-table-column>
      <el-table-column prop="city" label="所在城市"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editCinema(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="deleteCinema(scope.row)"
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
import { cinema } from '@/api'
import { duration } from 'moment'
export default {
  created () {
    this.getCinemaInfo()
  },
  data () {
    return {
      cinemaData: [],
      total: 0,
      currentPage: 1,
      size: 10
    }
  },
  methods: {
    // 获取影院详情
    getCinemaInfo () {
      const params = {
        page: this.currentPage,
        size: this.size
      }
      cinema.queryByPage(params).then(res => {
        if (res.code === 0) {
          this.cinemaData = res.data.datas
          this.total = res.data.total
        }
      })
    },
    // 获取更多数据
    getMore (page) {
      this.currentPage = page
      this.getCinemaInfo()
    },
    // 编辑影院详情
    editCinema (row) {
      this.$router.push({
        path: '/cinemaManager/editCinema',
        query: { cinemaId: row.id }
      })
    },
    // 删除某个影院
    deleteCinema (row) {
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
          cinema.deleteCinema(row.id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1000,
                onClose: () => {
                  this.getCinemaInfo()
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
