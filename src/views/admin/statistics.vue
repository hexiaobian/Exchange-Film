<template>
  <div class="manager">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true"
    >
      <el-menu-item index="1" :route="{ name: 'UserManager' }">
        <i class="el-icon-menu"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>影院管理</span>
        </template>
        <el-menu-item index="2-1" :route="{ name: 'CinemaManager' }"
          >影院总览</el-menu-item
        >
        <el-menu-item index="2-2" :route="{ path: '/cinemaManager/editCinema' }"
          >上线影院</el-menu-item
        >
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>影片管理</span>
        </template>
        <el-menu-item index="3-1" :route="{ name: 'FilmManager' }"
          >影片总览</el-menu-item
        >
        <el-menu-item index="3-2" :route="{ path: '/filmManager/editFilm' }"
          >上新影片</el-menu-item
        >
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>排片管理</span>
        </template>
        <el-menu-item index="4-1" :route="{ name: 'ScheduleManager' }"
          >排片总览</el-menu-item
        >
        <el-menu-item index="4-2" :route="{ name: 'AddSchdule' }"
          >批量排片</el-menu-item
        >
      </el-submenu>
      <el-menu-item index="5" :route="{ name: 'ExchangeManager' }">
        <i class="el-icon-setting"></i>
        <span slot="title">换票管理</span>
      </el-menu-item>
      <el-menu-item index="6" :route="{ name: 'OrderManager' }">
        <i class="el-icon-setting"></i>
        <span slot="title">订单管理</span>
      </el-menu-item>
      <el-menu-item index="7" @click="logon">
        <i class="el-icon-unlock"></i>
        <span slot="title">退出登录</span>
      </el-menu-item>
    </el-menu>
    <div class="content">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logon () {
      this.$store.commit('logon')
      this.$router.replace({ name: 'Login' })
    }
  }
}
</script>
<style lang="less" scoped>
.manager {
  padding-left: 220px;
  .el-menu {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 200px;
  }
}
</style>
