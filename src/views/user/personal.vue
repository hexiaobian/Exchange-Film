<template>
  <div class="personal">
    <el-container>
      <el-aside width="180px">
        <el-menu
          default-active="2"
          background-color="#545c64"
          @select="handler"
        >
          <el-menu-item>
            <template slot="title">
              <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
              ></el-avatar>
            </template>
          </el-menu-item>
          <el-menu-item index="1">
            <i class="el-icon-user-solid"></i>
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-document"></i>
            <span slot="title">订单中心</span>
          </el-menu-item>
          <el-menu-item
            index="3"
            @click="$router.push({ path: '/personal/myExchange' })"
          >
            <i class="el-icon-setting"></i>
            <span slot="title">我的换票</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-form
          ref="infoForm"
          :model="infoForm"
          :disabled="true"
          label-width="80px"
          size="mini"
          v-if="activeIndex === '1'"
        >
          <el-form-item label="电话">
            <el-input v-model="infoForm.account"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="infoForm.nickName"></el-input>
          </el-form-item>
        </el-form>
        <div class="order" v-if="activeIndex === '2'">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="已付款" name="已付款">
              <div
                class="order-item"
                v-for="(p, i) in paidList"
                :key="i"
                @click="getTickets({ ticketsIds: p.ticketsIds, orderId: p.id })"
              >
                <el-divider content-position="left">{{
                  p.dealTime
                }}</el-divider>
                <div class="movie-name">{{ p.filmName }}</div>
                <div class="cinema-name">{{ p.cinemaName }}</div>
                <div class="tickets">
                  共{{ JSON.parse(p.ticketsIds).length }}张
                </div>
                <div class="price">{{ p.dealprice }}元</div>
              </div>
            </el-collapse-item>
            <el-collapse-item title="已处理" name="已处理">
              <div
                class="order-item forbid"
                v-for="(o, index) in processedList"
                :key="index"
              >
                <el-divider content-position="left">{{
                  o.dealTime
                }}</el-divider>
                <div class="movie-name">{{ o.filmName }}</div>
                <div class="cinema-name">{{ o.cinemaName }}</div>
                <div class="tickets">
                  共{{ JSON.parse(o.ticketsIds).length }}张
                </div>
                <div class="price">{{ o.dealprice }}元</div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { order, tickets } from '@/api'
import moment from 'moment'
export default {
  created () {
    this.init()
    this.getAllOrder(this.$store.state.userInfo.id)
  },
  data () {
    return {
      infoForm: {
        account: '',
        nickName: ''
      },
      showPersonal: true,
      activeIndex: '2',
      orderList: [],
      activeNames: [],
      processedList: [],
      paidList: []
    }
  },
  methods: {
    // 初始化
    init () {
      const { account, nickName } = this.$store.state.userInfo
      this.infoForm.account = account
      this.infoForm.nickName = nickName || '无'
    },
    // 获取用户的所有订单
    async getAllOrder (id) {
      const { getTicketbyId } = tickets
      order.getOrderByUserId(id).then(res => {
        if (res.code == 0) {
          const allOrder = JSON.parse(JSON.stringify(res.data))
          allOrder.forEach(a => {
            JSON.parse(a.ticketsIds).forEach(async t => {
              const result = await getTicketbyId(t)
              const yt = result.data
              if (new Date(yt.showtime) < new Date() && yt.isGet === false) {
                yt.isGet = true
                await tickets.updateTicket(yt.id, yt)
              }
              if (new Date(yt.showtime) < new Date() && yt.isGet === true) {
                a.orderStatus = '已处理'
                await order.updateOrder(a.id, a)
              }
            })
          })
        }
      })
      const result = await order.getOrderByUserId(id)
      if (result.code === 0) {
        const allOrder = result.data
        this.processedList = allOrder
          .filter(a => a.orderStatus === '已处理')
          .map(p => {
            p.dealTime = moment(p.dealTime).format('YYYY-MM-DD HH:mm:ss')
            return p
          })
        this.paidList = allOrder
          .filter(a => a.orderStatus === '已付款')
          .map(p => {
            p.dealTime = moment(p.dealTime).format('YYYY-MM-DD HH:mm:ss')
            return p
          })
      }
    },
    // 获取订单详情
    getTickets (idObj) {
      this.$router.push({
        name: 'Exchange',
        params: {
          idObj
        }
      })
    },
    // 切换中间显示的内容
    handler (index) {
      this.activeIndex = index
    },
    handleChange () {}
  }
}
</script>

<style lang="less" scoped>
.personal {
  > .el-container {
    padding-left: 180px;
    .el-aside {
      position: fixed;
      left: 0;
      top: 60px;
      height: 100vh;
      box-sizing: border-box;
      .el-menu {
        height: 100%;
        li:first-child {
          height: 120px;
          text-align: center;
          padding-top: 28px;
          .el-avatar {
            width: 60px;
            height: 60px;
          }
        }
      }
    }
    .el-main {
      .el-form {
        width: 50%;
        margin: 50px auto;
      }
      .order {
        width: 80%;
        margin: 0 auto;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
        .order-item {
          position: relative;
          height: 80px;
          margin-bottom: 10px;
          cursor: pointer;
          &.forbid {
            cursor: not-allowed;
          }
          .movie-name {
            color: #409eff;
            font-size: 20px;
          }
          .cinema-name {
            color: #909399;
            font-size: 10px;
          }
          .tickets {
            position: absolute;
            right: 0;
            top: 50px;
          }
          .price {
            position: absolute;
            right: 0;
            top: 20px;
            color: #79bbff;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
