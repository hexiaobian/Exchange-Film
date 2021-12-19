<template>
  <div class="trade-container">
    <div class="trade">
      <exchange-card :tickets="currentUserExchange" />
      <i class="el-icon-right"></i>
      <exchange-card :tickets="currentExchange" />
    </div>
    <div class="buy">
      差额：<span>{{ balance.toFixed(2) }}元</span>
      <el-button type="primary" @click="goExchange">支付</el-button>
    </div>
  </div>
</template>

<script>
import { tickets, order, exchange } from "@/api";
import ExchangeCard from "./components/exchangeCard.vue";
export default {
  components: {
    ExchangeCard
  },
  created() {
    this.init();
  },
  data() {
    return {
      currentExchange: [],
      currentUserExchange: [],
      balance: 0
    };
  },
  methods: {
    // 初始化页面，获取页面的初始数据
    init() {
      const { currentExchange, currentUserExchange } = this.$route.params;
      const salePrice = currentExchange.price;
      const userPrice = currentUserExchange.price;
      const balance = salePrice - userPrice;
      if (balance > 0) {
        this.balance = balance;
      } else {
        this.balance = 0;
      }
      this.currentExchange.push(currentExchange);
      this.currentUserExchange.push(currentUserExchange);
    },
    // 点击支付按钮进行换票操作，涉及到改换票表（改targetId, isDeal, dealtime）、订单表(换票不生成订单？)和电影票表(改用户id)
    async goExchange() {
      let originObj = {};
      let targetObj = {};
      originObj.originExchangeId = this.currentUserExchange[0].exchangeId;
      originObj.originTargetId = this.currentExchange[0].userId;
      targetObj.targetExchangeId = this.currentExchange[0].exchangeId;
      targetObj.targetId = this.currentUserExchange[0].userId;
      let result = await exchange.saleExchange(
        originObj,
        targetObj,
        this.balance
      );
      if (result.code === 0) {
        this.$message({
          type: "success",
          message: "换票成功！",
          duration: 1000,
          onClose: () => {
            this.$router.push({ name: "Personal" });
          }
        });
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          duration: 1000
        });
      }
      console.log(result);
      // return;
      // Promise.all([
      //   await exchange.saleExchange(
      //     this.currentExchange[0].exchangeId,
      //     this.currentUserExchange[0].exchangeId,
      //     this.currentUserExchange[0].userId,
      //     userPrice
      //   ),
      //   await exchange.saleExchange(
      //     this.currentUserExchange[0].exchangeId,
      //     this.currentExchange[0].exchangeId,
      //     this.currentExchange[0].userId,
      //     price
      //   )
      // ]).then(res => {
      //   if (res.filter(r => r.code !== 0).length > 0) {
      //     this.$message({
      //       type: "error",
      //       message: "未知错误，请重试"
      //     });
      //   } else {
      //     this.$router.push({ name: "Personal" });
      //   }
      // });
    }
  }
};
</script>

<style lang="less" scoped>
.trade-container {
  width: 60%;
  margin: 20px auto;
  .trade {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    .el-icon-right {
      width: 100px;
      font-size: 70px;
      font-weight: 800;
      color: #409eff;
    }
  }
  .buy {
    position: relative;
    width: 100%;
    height: 80px;
    line-height: 60px;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    font-size: 16px;
    color: #303133;
    span {
      color: #409eff;
    }
    .el-button {
      position: absolute;
      right: 10px;
      top: 30px;
      padding: 5px 10px;
    }
  }
}
</style>
