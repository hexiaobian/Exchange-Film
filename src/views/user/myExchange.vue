<template>
  <div class="exchange">
    <el-button type="primary" @click="toShow(1)">交易成功</el-button>
    <el-button @click="toShow(2)" type="danger">交易失败</el-button>
    <el-button @click="toShow(3)">正在交易</el-button>
    <div class="exchange-container">
      <div class="isExchange" v-if="isShow === 1">
        <div class="deal-body">
          <div
            class="deal-item"
            v-for="(exchangeItem, index) in exchangeArr"
            :key="index"
          >
            <div class="film">{{ exchangeItem.filmName }}</div>
            <div class="cinema">{{ exchangeItem.cinemaName }}</div>
            <div class="state">
              交易状态
              <i class="el-icon-success"></i>
            </div>
            <div class="time">放映时间：{{ exchangeItem.showtime }}</div>
            <div class="dealtime">交易时间：{{ exchangeItem.dealtime }}</div>
            <div class="price">成交金额：{{ exchangeItem.price }}元</div>
            <div class="targetAccount">
              {{ exchangeItem.type === "换票" ? "换方" : "买方" }}：{{
                exchangeItem.targetAccount
              }}
            </div>
            <div class="type">
              交易类型：
              <el-tag type="success">{{ exchangeItem.type }}</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="loseExchange" v-else-if="isShow === 2">
        <div class="deal-body">
          <div
            class="deal-item"
            v-for="(exchangeItem, index) in loseExchangeArr"
            :key="index"
          >
            <div class="film">{{ exchangeItem.filmName }}</div>
            <div class="cinema">{{ exchangeItem.cinemaName }}</div>
            <div class="state">
              交易状态
              <i class="el-icon-error"></i>
            </div>
            <div class="time">放映时间：{{ exchangeItem.showtime }}</div>
            <div class="dealtime">交易时间：{{ exchangeItem.dealtime }}</div>
            <div class="price">金额：{{ exchangeItem.price }}元</div>
            <div class="targetAccount">
              {{ exchangeItem.type === "换票" ? "换方" : "买方" }}：无
            </div>
            <div class="type">
              交易类型：
              <el-tag type="success">{{ exchangeItem.type }}</el-tag>
            </div>
          </div>
        </div>
      </div>
      <div class="nonExchange" v-else>
        <div class="deal-body">
          <div
            class="deal-item"
            v-for="(exchangeItem, index) in nonExchangeArr"
            :key="index"
          >
            <div class="film">{{ exchangeItem.filmName }}</div>
            <div class="cinema">{{ exchangeItem.cinemaName }}</div>
            <div class="state">
              交易状态
              <i class="el-icon-loading"></i>
            </div>
            <div class="time">放映时间：{{ exchangeItem.showtime }}</div>
            <div class="dealtime">交易时间：{{ exchangeItem.dealtime }}</div>
            <div class="price">金额：{{ exchangeItem.price }}元</div>
            <div class="targetAccount">
              {{ exchangeItem.type === "换票" ? "换方" : "买方" }}：暂无
            </div>
            <div class="type">
              交易类型：
              <el-tag type="success">{{ exchangeItem.type }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { exchange } from "@/api";
export default {
  created() {
    const userId = this.$store.state.userInfo.id;
    this.getPersonalExchange(userId);
  },
  data() {
    return {
      exchangeArr: [],
      nonExchangeArr: [],
      loseExchangeArr: [],
      isShow: 1
    };
  },
  methods: {
    // 获取该用户的所有换票记录
    async getPersonalExchange(userId) {
      try {
        const result = await exchange.selectUserAll(userId);
        console.log(result);
        if (result.code === 0) {
          this.exchangeArr = result.data.filter(e => e.isDeal);
          this.nonExchangeArr = result.data.filter(
            e => !e.isDeal && new Date(e.showtime) >= new Date()
          );
          this.loseExchangeArr = result.data.filter(
            e => !e.isDeal && new Date(e.showtime) < new Date()
          );
        }
      } catch (err) {
        this.$message({
          type: "error",
          message: err.message
        });
      }
    },
    toShow(type) {
      this.isShow = type;
    }
  }
};
</script>
<style lang="less" scoped>
.exchange {
  width: 60%;
  margin: 20px auto;
  .exchange-container {
    margin-top: 20px;
    .deal-body {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .deal-item {
        position: relative;
        width: 45%;
        box-sizing: border-box;
        padding: 15px;
        border: 1px solid #409eff;
        margin-bottom: 10px;
        background-image: linear-gradient(90deg, #409eff, #79bbff);
        background-size: 100% 10px;
        background-repeat: no-repeat;
        .film {
          font-size: 20px;
        }
        .cinema {
          color: #909399;
        }
        .state {
          position: absolute;
          right: 10px;
          top: 20px;
          i {
            font-size: 30px;
            vertical-align: middle;
            &.el-icon-success {
              color: #67c23a;
            }
            &.el-icon-error {
              color: #f56c6c;
            }
            &.el-icon-loading {
              color: #409eff;
            }
          }
        }
      }
    }
  }
}
</style>
