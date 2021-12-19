<template>
  <div class="exchange">
    <el-table :data="exchangeData" style="width: 100%">
      <el-table-column prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="type" label="交易类型"> </el-table-column>
      <el-table-column prop="userId" label="原用户id"> </el-table-column>
      <el-table-column prop="userAccount" label="原用户账号"> </el-table-column>
      <el-table-column prop="targetId" label="目标用户id"> </el-table-column>
      <el-table-column prop="targetAccount" label="目标用户账号">
      </el-table-column>
      <el-table-column prop="discount" label="差额交易"> </el-table-column>
      <el-table-column prop="dealtime" label="交易时间"> </el-table-column>
      <el-table-column prop="isDeal" label="交易是否完成"> </el-table-column>
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
import { exchange, user } from '@/api'
import moment from 'moment'
export default {
  created () {
    this.getExchangeData()
  },
  data () {
    return {
      exchangeData: [],
      total: 0,
      currentPage: 1
    }
  },
  methods: {
    // 获取所有换票信息
    getExchangeData () {
      const params = {
        page: this.currentPage,
        size: 10
      }
      exchange.selectAll(params).then(res => {
        if (res.code === 0) {
          this.total = res.data.count
          const proms = res.data.rows.map(async r => {
            const exchangeItem = {}
            exchangeItem.id = r.id
            exchangeItem.type = r.type
            exchangeItem.discount = r.discount
            exchangeItem.dealtime = moment(new Date(r.dealtime)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            exchangeItem.isDeal = r.isDeal ? '已交易' : '未交易'
            exchangeItem.ticketId = r.ticketId
            const userInfo = await user.findUserById(r.userId)
            const targetInfo = r.targetId
              ? await user.findUserById(r.targetId)
              : ''
            if (userInfo.code === 0) {
              exchangeItem.userId = userInfo.data.id
              exchangeItem.userAccount = userInfo.data.account
            }
            if (!targetInfo) {
              exchangeItem.targetId = '无'
              exchangeItem.targetAccount = '无'
            }
            if (targetInfo.code === 0) {
              exchangeItem.targetId = targetInfo.data.id
              exchangeItem.targetAccount = targetInfo.data.account
            }
            return exchangeItem
          })
          Promise.all(proms).then(res => {
            this.exchangeData = res
          })
        }
      })
    },
    // 分页获取更多数据
    getMore (page) {
      this.currentPage = page
      this.getExchangeData()
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
