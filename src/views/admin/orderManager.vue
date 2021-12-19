<template>
  <div class="order">
    <el-table :data="orderData" style="width: 100%">
      <el-table-column prop="id" label="id" width="50"> </el-table-column>
      <el-table-column prop="userId" label="用户id" width="70">
      </el-table-column>
      <el-table-column prop="userAccount" label="用户账号"> </el-table-column>
      <el-table-column prop="filmName" label="影片名字"> </el-table-column>
      <el-table-column prop="cinemaName" label="影院名字"> </el-table-column>
      <el-table-column prop="dealprice" label="成交价格"> </el-table-column>
      <el-table-column prop="dealTime" label="成交时间"> </el-table-column>
      <el-table-column prop="ticketsIds" label="订单id集"> </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态"> </el-table-column>
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
import { order, user } from '@/api'
import moment from 'moment'
export default {
  created () {
    this.getOrderData()
  },
  data () {
    return {
      orderData: [],
      total: 0,
      currentPage: 1
    }
  },
  methods: {
    // 分页获取所有订单信息
    getOrderData () {
      const params = {
        page: this.currentPage,
        size: 10
      }
      order.getAllOrder(params).then(res => {
        if (res.code === 0) {
          this.total = res.data.count
          Promise.all(
            res.data.rows.map(async r => {
              r.dealTime = moment(new Date(r.dealTime)).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              const ures = await user.findUserById(r.userId)
              if (ures.code === 0) {
                r.userAccount = ures.data.account
              }
              return r
            })
          ).then(orderResult => {
            this.orderData = orderResult
          })
        }
      })
    },
    // 分页获取更多数据
    getMore (page) {
      this.currentPage = page
      this.getOrderData()
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
