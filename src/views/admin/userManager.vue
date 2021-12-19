<template>
  <div class="user">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="nickname" label="姓名" width="280">
      </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
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
import { user } from '@/api'
export default {
  created () {
    this.queryByPage()
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      size: 10,
      total: 0
    }
  },
  methods: {
    // 分页查询用户信息
    queryByPage () {
      const params = {
        page: this.currentPage,
        size: this.size
      }
      user.queryByPage(params).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.datas.map(t => {
            if (t.nickname == null) {
              t.nickname = '无昵称'
            }
            return t
          })
          this.total = res.data.total
        }
      })
    },
    // 改变当前页获取信息
    getMore (page) {
      this.currentPage = page
      this.queryByPage()
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
