<template>
  <div class="schedule-container">
    <div class="schedule-item" v-for="c in currentSchedule" :key="c.id">
      <div class="info-item">
        <div class="time">
          {{ c.showTime.time }}
        </div>
        <div class="loc">
          <span>原版3D</span>
          <span>一号厅</span>
        </div>
        <div class="buy">
          <div class="price">{{ c.price }}元</div>
          <el-button type="primary" @click="goToBuy(c.id)">购票</el-button>
        </div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    currentSchedule: {
      type: Array,
      required: true
    }
  },
  methods: {
    goToBuy (id) {
      this.$emit('goToBuy', id)
    }
  }
}
</script>
<style lang="less" scoped>
.schedule-item {
  position: relative;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
  padding: 10px 25px;
  .info-item {
    height: 40px;
    .time-loc {
      position: absolute;
      width: 40%;
      display: flex;
      align-items: center;
      left: 25px;
      top: 10px;
      .time {
        color: #409eff;
        font-size: 20px;
        font-weight: 600;
        margin-right: 20px;
      }
    }
    .buy {
      position: absolute;
      width: 40%;
      right: 25px;
      top: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .price {
        color: #409eff;
        font-size: 16px;
        font-weight: 600;
        margin-right: 20px;
      }
      .el-button {
        padding: 5px 8px;
      }
    }
    .el-divider--horizontal {
      width: 100%;
      bottom: 10px;
    }
  }
}
</style>
