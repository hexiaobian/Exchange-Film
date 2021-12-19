<template>
  <div class="noData" v-if="noData">
    <no-data />
  </div>
  <div class="exchange-container" v-else>
    <exchange-card
      :tickets="tickets"
      :isSelf="true"
      @showDialog="showDialog"
      @cancel="cancel"
    />
    <el-dialog
      title="请选择您要进行的操作"
      :visible.sync="centerDialogVisible"
      width="30%"
      center
    >
      <el-button @click="operateTicket(1)">卖票</el-button>
      <el-button @click="operateTicket(2)">换票</el-button>
      <el-button @click="operateTicket(3)">退票</el-button>

      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmExchange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { tickets, cinema, film, exchange } from '@/api'
import moment from 'moment'
import ExchangeCard from '@/views/user/components/exchangeCard.vue'
import NoData from '@/views/noData.vue'
export default {
  components: {
    ExchangeCard,
    NoData
  },
  data () {
    return {
      noData: false,
      tickets: [],
      orderId: 0,
      centerDialogVisible: false,
      operateId: 0,
      operateType: 1,
      exchangeArr: []
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.name === 'Personal') {
      next(vm => {
        vm.init()
      })
    }
  },
  methods: {
    // 获取初始数据
    async init () {
      const { ticketsIds, orderId } = this.$route.params.idObj
      this.orderId = orderId
      const userId = this.$store.state.userInfo.id
      await this.getInfo(userId, ticketsIds)
    },
    // 获取页面数据
    async getInfo (userId, ticketsIds) {
      await this.getExchangeInfo(userId)
      JSON.parse(ticketsIds).forEach(async id => {
        await this.getTicketInfo(id)
      })
    },
    // 获取影票信息
    async getTicketInfo (id) {
      this.tickets = []
      const ticketResult = await tickets.getTicketbyId(id)
      if (ticketResult.code === 0) {
        const {
          cinemaId,
          filmId,
          seat,
          showtime,
          price,
          id
        } = ticketResult.data
        const cinemaResult = await cinema.getCinemaDetail(cinemaId)
        const filmResult = await film.getDetail(filmId)
        if (cinemaResult.code === 0 && filmResult.code === 0) {
          const cinemaName = cinemaResult.data.name
          const filmName = filmResult.data.name
          const ticket = {}
          ticket.id = id
          ticket.cinemaName = cinemaName
          ticket.filmName = filmName
          ticket.seat = seat
          ticket.showtime = moment(showtime).format('YYYY-MM-DD HH:mm:ss')
          ticket.price = price
          ticket.isSale = !!this.judgeSale(id)
          ticket.isChange = !!this.judgeExchange(id)
          this.tickets.push(ticket)
        }
        if (this.tickets.length === 0) {
          this.noData = true
        }
      }
    },
    // 获取换票信息
    async getExchangeInfo (id) {
      const result = await exchange.judgeByUserId(id)
      if (result.code === 0) {
        const exchangeArr = result.data
        this.exchangeArr = exchangeArr.map(e => ({
          ticketId: e.ticketId,
          type: e.type
        }))
      }
    },
    // 判断是否属于卖票的影票
    judgeSale (id) {
      if (
        this.exchangeArr.filter(e => e.ticketId === id && e.type === '卖票')
          .length > 0
      ) {
        return true
      }
    },
    // 判断是否属于换票的影票
    judgeExchange (id) {
      if (
        this.exchangeArr.filter(e => e.ticketId === id && e.type === '换票')
          .length > 0
      ) {
        return true
      }
    },
    // 点击显示操作栏
    showDialog (id) {
      this.operateId = id
      this.centerDialogVisible = true
    },
    // 进行相关操作
    operateTicket (operate) {
      this.operateType = operate
    },
    // 确认换票
    confirmExchange () {
      if (this.operateType === 1) {
        this.$router.push({
          name: 'RegisterMes',
          params: { ticketId: this.operateId, operate: '卖票' }
        })
      }
      if (this.operateType === 2) {
        this.$router.push({
          name: 'RegisterMes',
          params: { ticketId: this.operateId, operate: '换票' }
        })
      }
      if (this.operateType === 3) {
        this.$confirm('确认退票吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            if (
              // 放映前60分钟可退票
              new Date(
                this.tickets.filter(e => e.id === this.operateId)[0].showtime
              ) -
                new Date() >
              60 * 60 * 1000
            ) {
              tickets.destoryTicket(this.operateId, this.orderId).then(res => {
                if (res.code === 404) {
                  this.noData = true
                }
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: '删除成功！',
                    duration: 1000,
                    onClose: async () => {
                      await this.getInfo(
                        this.$store.state.userInfo.id,
                        res.data.ticketsIds
                      )
                    }
                  })
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '超过可退票时间，此影票不可退！'
              })
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消退票'
            })
          })
      }
      this.centerDialogVisible = false
    },
    async cancel (info) {
      const type = info.type === 'exchange' ? '换票' : '卖票'
      this.$confirm(`此操作是取消${type}操作，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const result = await exchange.deleteExchange(info.id)
          if (result.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.tickets = []
            this.init()
          }
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
.exchange-container {
  width: 80%;
  margin: 20px auto;
}
</style>
