<template>
  <div class="exchange-region">
    <div class="my-exchange">
      <div class="changeContent">
        <el-button @click="switchTab(1)" autofocus>我的卖票</el-button>
        <el-button @click="switchTab(2)">我的换票</el-button>
      </div>
      <exchange-card
        class="saleArr"
        v-if="isUserSale"
        :isAll="false"
        :tickets="userSaleArr"
        @cancel="cancel"
      />
      <no-data v-if="isUserSale && userSaleArr.length === 0" />
      <exchange-card
        class="exchangeArr"
        v-if="isUserChange"
        :tickets="userExchangeArr"
        :isAll="false"
      />
      <no-data v-if="isUserChange && userExchangeArr.length === 0" />
      <el-dialog title="您的换票" :visible.sync="dialogTableVisible">
        <exchange-card
          class="exchangeArr"
          :tickets="userExchangeArr"
          :isAll="false"
          :operate="true"
          @exchangeTicket="exchangeTicket"
        />
      </el-dialog>
    </div>
    <div class="all-exchange">
      <div class="changeContent">
        <el-button @click="switchTab(3)" autofocus>买票</el-button>
        <el-button @click="switchTab(4)">换票</el-button>
      </div>
      <exchange-card
        class="saleArr"
        v-if="isSale"
        :tickets="saleArr"
        :isAll="true"
        @goToBuy="goToBuy"
      />
      <no-data v-if="isSale && saleArr.length === 0" />
      <exchange-card
        class="exchangeArr"
        v-if="isChange"
        :tickets="exchangeArr"
        :isAll="true"
        @emitExchange="emitExchange"
      />
      <no-data v-if="isChange && exchangeArr.length === 0" />
    </div>
  </div>
</template>

<script>
import { exchange, tickets, film, cinema } from "@/api";
import moment from "moment";
import ExchangeCard from "@/views/user/components/exchangeCard.vue";
import NoData from "@/views/noData.vue";

export default {
  async created() {
    const userId = this.$store.state.userInfo.id;
    await this.getAllExchange();
    await this.getAllExchangeByUserId(userId);
  },
  components: {
    ExchangeCard,
    NoData
  },
  data() {
    return {
      exchangeArr: [],
      saleArr: [],
      userExchangeArr: [],
      userSaleArr: [],
      isChange: false,
      isSale: true,
      isUserChange: false,
      isUserSale: true,
      dialogTableVisible: false,
      currentExchange: {}
    };
  },
  methods: {
    // 获得所有的换票信息
    async getAllExchange() {
      const res = await exchange.filterExchange();
      if (res.code === 0) {
        let allExchange = res.data;
        allExchange = allExchange.filter(
          a => a.userId !== +this.$store.state.userInfo.id
        );
        await this.getAllInfo(allExchange, "all");
      }
    },
    // 根据用户id获得用户的所有换票信息
    async getAllExchangeByUserId(id) {
      const result = await exchange.judgeByUserId(id);
      if (result.code === 0) {
        const allExchange = result.data;
        await this.getAllInfo(allExchange, "user");
      }
    },

    // 得到所有关于影票的信息，type是用来区分是用户的所有换票信息还是全部换票信息
    async getAllInfo(allExchange, type) {
      const allTickets = allExchange.map(async a => {
        const result = await tickets.getTicketbyId(a.ticketId);
        if (result.code === 0) {
          const ticketObj = {
            ticketInfo: result.data,
            exchangeId: a.id,
            discount: a.discount,
            type: a.type
          };
          return ticketObj;
        }
      });
      await Promise.all(allTickets).then(allResults => {
        const validateResults = allResults.filter(v => v !== undefined);
        Promise.all(
          validateResults.map(async r => {
            let { seat, showtime, userId, price, id } = r.ticketInfo;
            showtime = moment(showtime).format("YYYY-MM-DD HH:mm:ss");
            const filmResult = await film.getDetail(r.ticketInfo.filmId);
            const cinemaResult = await cinema.getCinemaDetail(
              r.ticketInfo.cinemaId
            );
            if (filmResult.code === 0 && cinemaResult.code === 0) {
              const filmName = filmResult.data.name;
              const cinemaName = cinemaResult.data.name;
              const ticketId = id;
              price = r.discount;
              const type = r.type;
              const exchangeId = r.exchangeId;
              return {
                filmName,
                cinemaName,
                price,
                seat,
                showtime,
                userId,
                type,
                ticketId,
                exchangeId
              };
            }
          })
        ).then(nameObjs => {
          if (type === "all") {
            this.saleArr = nameObjs.filter(e => e.type === "卖票");
            this.exchangeArr = nameObjs.filter(e => e.type === "换票");
          }
          if (type === "user") {
            this.userSaleArr = nameObjs.filter(e => e.type === "卖票");
            this.userExchangeArr = nameObjs.filter(e => e.type === "换票");
          }
        });
      });
    },
    // 切换tab栏
    switchTab(num) {
      if (num === 1) {
        this.isUserSale = true;
        this.isUserChange = false;
      }
      if (num === 2) {
        this.isUserSale = false;
        this.isUserChange = true;
      }
      if (num === 3) {
        this.isSale = true;
        this.isChange = false;
      }
      if (num === 4) {
        this.isSale = false;
        this.isChange = true;
      }
    },
    // 去TicketsOrder页支付
    async goTicketsOrder(ticketsArr, idInfo) {
      const currentTicket = ticketsArr.find(
        s => s.ticketId === idInfo.ticketId
      );
      const { price, seat } = currentTicket;
      const seats = [];
      seats.push(JSON.parse(seat));

      const tResult = await tickets.getTicketbyId(idInfo.ticketId);
      if (tResult.code === 0) {
        const tData = tResult.data;
        const { cinemaId, filmId, showtime } = tData;
        const params = {
          cinemaId,
          filmId,
          price,
          seat: seats,
          showtime
        };
        this.$router.push({
          name: "TicketsOrder",
          params: { obj: params }
        });
      }
    },
    // 买票
    async goToBuy(idInfo) {
      this.$confirm("确定购买此票吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.goTicketsOrder(this.saleArr, idInfo);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 换票
    async emitExchange(idInfo) {
      if (this.userExchangeArr.length === 0) {
        this.$confirm(
          "您暂无要换的影票，请到个人中心进行换票操作，是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.$router.push({ name: "Personal" });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      } else {
        this.dialogTableVisible = true;
        const { exchangeId } = idInfo;
        this.currentExchange = this.exchangeArr.find(
          s => s.exchangeId === exchangeId
        );
      }
    },
    // 确认换票
    exchangeTicket(idInfo) {
      const { exchangeId } = idInfo;
      const currentUserExchange = this.userExchangeArr.find(
        u => u.exchangeId === exchangeId
      );
      const userPrice = currentUserExchange.price;
      const salePrice = this.currentExchange.price;
      let tip = "";
      if (userPrice > salePrice) {
        tip = "您的影票价格较高，是否愿意继续交换？";
      } else if (userPrice === salePrice) {
        tip = "等票价进行交换，是否继续？";
      } else {
        tip = `您的票价低于此票价，需要再支付${(salePrice - userPrice).toFixed(
          2
        )}元，方可进行换票，是否继续？`;
      }
      this.$confirm(tip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.push({
          name: "Trade",
          params: {
            currentUserExchange,
            currentExchange: this.currentExchange
          }
        });
      });
    },
    // 取消换票
    async cancel(info) {
      const type = info.type === "exchange" ? "换票" : "卖票";
      this.$confirm(`此操作是取消${type}操作，是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const result = await exchange.deleteExchange(info.id);
          if (result.code === 0) {
            this.$message({
              type: "success",
              message: "取消成功!"
            });
            if (info.type === "exchange") {
              this.userExchangeArr = [];
              this.init();
            } else {
              this.userSaleArr = [];
              this.init();
            }
          } else {
            this.$message({
              type: "error",
              message: result.msg
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="less" scoped>
.all-exchange,
.my-exchange {
  .changeContent {
    margin-bottom: 20px;
  }
}
</style>
