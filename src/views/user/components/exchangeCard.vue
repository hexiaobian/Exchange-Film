<template>
  <div class="exchange">
    <div class="exchange-item" v-for="(t, i) in tickets" :key="i">
      <div class="film-name">{{ t.filmName }}</div>
      <div class="cinema-name">{{ t.cinemaName }}</div>
      <div class="seat">
        座位号：
        <span>
          {{ `${JSON.parse(t.seat)[0]}排${JSON.parse(t.seat)[1]}列` }}
        </span>
      </div>
      <div class="price">{{ t.price }}元</div>
      <div class="showtime">
        放映时间：
        <span>{{ t.showtime }}</span>
      </div>
      <div class="operate">
        <el-tooltip
          class="item"
          effect="dark"
          content="取消换票"
          placement="top-end"
          v-if="
            t.isChange ||
              (t.type === '换票' && isAll !== true && operate !== true)
          "
        >
          <el-button
            @click="
              cancel({
                type: 'exchange',
                id: t.id === undefined ? t.ticketId : t.id
              })
            "
            >换票中</el-button
          >
        </el-tooltip>
        <el-button
          v-else-if="t.type === '换票' && isAll === true"
          @click="
            emitExchange({
              userId: t.userId,
              ticketId: t.ticketId,
              exchangeId: t.exchangeId
            })
          "
          >换票中</el-button
        >
        <el-button
          v-else-if="t.type === '换票' && operate === true"
          @click="
            exchangeTicket({
              userId: t.userId,
              ticketId: t.ticketId,
              exchangeId: t.exchangeId
            })
          "
          >换票中</el-button
        >
        <el-tooltip
          effect="dark"
          content="取消卖票"
          placement="top-end"
          v-else-if="t.isSale || (t.type === '卖票' && isAll !== true)"
        >
          <el-button
            @click="
              cancel({
                type: 'sale',
                id: t.id === undefined ? t.ticketId : t.id
              })
            "
            >卖票中</el-button
          >
        </el-tooltip>
        <el-button
          v-else-if="isAll"
          @click="
            goToBuy({
              ticketId: t.ticketId,
              userId: t.userId,
              exchangeId: t.exchangeId
            })
          "
          >买票</el-button
        >
        <el-button disabled v-else-if="!!t.isSale && isSelf === true"
          >已卖{{ t.isChange }}</el-button
        >
        <el-button disabled v-else-if="!!t.isChange && isSelf === true"
          >已换</el-button
        >
        <el-button type="primary" v-else @click="showDialog(t.id)"
          >操作</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tickets: {
      type: Array,
      require: true
    },
    type: {
      type: String,
      default: ''
    },
    isAll: {
      type: Boolean
    },
    operate: {
      type: Boolean
    },
    isSelf: {
      type: Boolean
    }
  },
  methods: {
    // 触发父级的showDialog事件
    showDialog (id) {
      this.$emit('showDialog', id)
    },
    // 触发父级的取消事件
    cancel (info) {
      this.$emit('cancel', info)
    },
    // 触发父元素的买票事件
    goToBuy (idInfo) {
      this.$emit('goToBuy', idInfo)
    },
    // 触发父元素的换票事件
    emitExchange (idInfo) {
      this.$emit('emitExchange', idInfo)
    },
    // 确定触发父元素的换票事件
    exchangeTicket (idInfo) {
      this.$emit('exchangeTicket', idInfo)
    }
  }
}
</script>
<style lang="less" scoped>
.exchange {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  color: #303133;
  font-size: 14px;
  .exchange-item {
    position: relative;
    flex: 1;
    flex-basis: 300px;
    height: 150px;
    padding-top: 10px;
    padding-left: 10px;
    margin-bottom: 20px;
    margin-right: 20px;
    border: 1px solid #409eff;
    background-image: linear-gradient(90deg, #409eff, #79bbff);
    background-size: 100% 10px;
    background-repeat: no-repeat;
    line-height: 1.5;
    &:last-child {
      margin-right: 0;
    }
    .film-name {
      color: #409eff;
      font-size: 20px;
    }
    .cinema-name {
      color: #909399;
      font-size: 10px;
      margin-bottom: 35px;
    }
    .price {
      position: absolute;
      right: 15px;
      top: 16px;
      color: #409eff;
    }
    .showtime,
    .seat {
      span {
        color: #79bbff;
      }
    }
    .operate {
      position: absolute;
      right: 20px;
      bottom: 30px;
      .el-button {
        padding: 5px 10px;
      }
    }
  }
}
</style>
