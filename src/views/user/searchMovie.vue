<template>
  <div class="search-movie">
    <el-menu
      mode="horizontal"
      :router="true"
      :default-active="showPersonal ? '2' : '4'"
    >
      <el-menu-item index="1" :route="{ name: 'Index' }">首页</el-menu-item>
      <el-menu-item index="2" :route="{ name: 'Condition' }">电影</el-menu-item>
      <el-menu-item index="3" :route="{ name: 'ExchangeRegion' }"
        >换票区</el-menu-item
      >
      <el-submenu index="5" v-if="showPersonal">
        <template slot="title">我的</template>
        <el-menu-item index="4-1" :route="{ name: 'Personal' }"
          >个人中心</el-menu-item
        >
        <el-menu-item index="4-2" :route="{ name: 'Order' }"
          >订单管理</el-menu-item
        >
      </el-submenu>
      <el-menu-item index="4" v-else>我的</el-menu-item>
    </el-menu>
    <el-input
      class="search-input"
      placeholder="搜索电影、演员"
      v-model="searchWord"
      clearable
      @change="searchMovies"
    >
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.showPersonal = this.$route.meta.name != 'personal'
  },
  data () {
    return {
      searchWord: '',
      showPersonal: true
    }
  },
  methods: {
    searchMovies (kw) {
      this.$router.push({ path: '/search/keyword', query: { kw } })
    }
  }
}
</script>

<style lang="less" scoped>
.search-movie {
  position: relative;
  .search-input {
    position: fixed;
    top: 10px;
    left: 50%;
    margin-left: -200px;
    z-index: 101;
    width: 400px;
  }
  .el-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 100;
    .el-submenu {
      float: right;
    }
  }
  .container {
    position: relative;
    top: 60px;
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>
