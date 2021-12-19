<template>
  <div class="saleTicket">
    <div class="tip">登记影票信息</div>
    <el-form :model="ticketForm" ref="ticketForm" label-width="100px">
      <el-form-item label="影片名称" prop="filmName">
        <el-input v-model="ticketForm.filmName" disabled>{{
          ticketForm.filmName
        }}</el-input>
      </el-form-item>
      <el-form-item label="影院名称" prop="cinemaName">
        <el-input v-model="ticketForm.cinemaName" disabled>{{
          ticketForm.cinemaName
        }}</el-input>
      </el-form-item>
      <el-form-item label="放映时间" prop="showtime">
        <el-input v-model="ticketForm.showtime" disabled>{{
          ticketForm.showtime
        }}</el-input>
      </el-form-item>
      <el-form-item label="座位号" prop="seat">
        <el-input v-model="ticketForm.seat" disabled>
          {{ ticketForm.seat }}</el-input
        >
      </el-form-item>
      <el-form-item
        label="价格"
        prop="price"
        :rules="[
          { required: true, message: '价格必填', trigger: 'blur' },
          {
            type: 'number',
            min: 0,
            max: maxPrice,
            message: '为避免黄牛操作，价格必须低于原价且价格不得低于0',
            trigger: ['blur', 'change']
          },
          {
            validator: validatePrice,
            trigger: ['blur', 'change']
          }
        ]"
      >
        <el-input
          v-model.number="ticketForm.price"
          type="number"
          :disabled="!changeable"
          @input="checkValidity"
          >{{ ticketForm.price }}</el-input
        >
      </el-form-item>
      <el-form-item label="差价交易" prop="difference">
        <el-tooltip
          class="item"
          effect="dark"
          content="以低于原票价进行交易"
          placement="top-end"
        >
          <el-switch
            v-model="ticketForm.difference"
            @change="selectDiffer"
          ></el-switch>
        </el-tooltip>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ticketForm')"
          >立即创建</el-button
        >
        <el-button @click="resetForm">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { tickets, film, cinema, exchange } from "@/api";
import moment from "moment";
// 登记换票所需信息
export default {
  created() {
    const { operate } = this.$route.params;
    this.operate = operate;
    this.getExchangeInfo(this.$route.params.ticketId);
  },
  data() {
    let validatePrice = (rule, value, cb) => {
      console.log(value);
      let radix = value.toString().includes(".")
        ? value.toString().split(".")[1].length
        : 0;
      if (radix > 2) {
        return cb(new Error("价格最多只有两位小数"));
      } else {
        return cb();
      }
    };
    return {
      validatePrice: validatePrice,
      changeable: false,
      maxPrice: 0,
      ticketForm: {
        filmName: "",
        cinemaName: "",
        price: 0,
        seat: "",
        showtime: "",
        difference: false,
        operate: ""
      }
    };
  },
  methods: {
    // 获取影票数据
    async getExchangeInfo(id) {
      const ticketResult = await tickets.getTicketbyId(id);
      if (ticketResult.code === 0) {
        const {
          id,
          filmId,
          cinemaId,
          price,
          seat,
          showtime
        } = ticketResult.data;
        this.maxPrice = price;
        const filmResult = await film.getDetail(filmId);
        const cinemaResult = await cinema.getCinemaDetail(cinemaId);
        if (filmResult.code === 0 && cinemaResult.code === 0) {
          const filmName = filmResult.data.name;
          const cinemaName = cinemaResult.data.name;
          this.ticketForm.id = id;
          this.ticketForm.filmName = filmName;
          this.ticketForm.cinemaName = cinemaName;
          this.ticketForm.price = this.maxPrice;
          this.ticketForm.seat =
            JSON.parse(seat)[0] + "排" + JSON.parse(seat)[1] + "列";
          this.ticketForm.showtime = moment(showtime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
      }
    },
    // 差价交换
    selectDiffer(newVal) {
      this.changeable = newVal;
      this.ticketForm.difference = newVal;
    },
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validateField("price", errorMessage => {
        if (errorMessage.length <= 0) {
          if (
            this.ticketForm.price === this.maxPrice &&
            this.ticketForm.difference
          ) {
            this.$confirm("未改变价格，将取消差价交易", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).finally(() => {
              this.ticketForm.difference = false;
              this.changeable = false;
              return;
            });
          } else {
            let msg = "";
            if (this.operate === "卖票") {
              msg = "确定卖出此电影票吗？";
            }
            if (this.operate === "换票") {
              msg = "确定换票吗？";
            }
            this.$confirm(msg, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                const params = {
                  ticketId: this.ticketForm.id,
                  userNickname: this.$store.state.userInfo.nickname,
                  userId: this.$store.state.userInfo.id,
                  targetId: null,
                  type: this.operate,
                  discount: this.ticketForm.price
                };
                exchange.saleTicket(params).then(res => {
                  if (res.code === 0) {
                    this.$message({
                      type: "success",
                      message: "操作成功！",
                      duration: 1000,
                      onClose: () => {
                        this.$router.push({
                          name: "ExchangeRegion"
                        });
                      }
                    });
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "error"
                    });
                  }
                });
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消卖出！"
                });
              });
          }
        } else {
          this.ticketForm.price = this.maxPrice;
          this.ticketForm.difference = false;
          this.$message({
            type: "error",
            message: errorMessage
          });
        }
      });
    },
    // 取消操作
    resetForm() {
      this.$router.push({ name: "Personal" });
    },
    // 改变价格
    checkValidity(price) {}
  }
};
</script>
<style lang="less" scoped>
.saleTicket {
  width: 50%;
  margin: 20px auto;
  .tip {
    width: 100%;
    text-align: center;
    color: #409eff;
    font-size: 20px;
    line-height: 2;
  }
}
</style>
