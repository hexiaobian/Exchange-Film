<template>
  <el-container class="index-container">
    <el-aside width="200px">
      <el-menu :default-active="activeIndex" :router="true">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>购票</span>
          </template>
          <el-menu-item index="1-1" :route="{ name: 'Hinting' }"
            >正在热映</el-menu-item
          >
          <el-menu-item index="1-2" :route="{ name: 'Upcoming' }"
            >即将上映</el-menu-item
          >
          <el-menu-item index="1-3" :route="{ name: 'Recommand' }"
            >推荐</el-menu-item
          >
        </el-submenu>
        <el-menu-item index="2" :route="{ name: 'Condition' }">
          <i class="el-icon-location"></i>
          <span slot="title">选电影</span>
        </el-menu-item>
        <el-menu-item index="3" :route="{ name: 'ExchangeRegion' }">
          <i class="el-icon-setting"></i>
          <span slot="title">换票区</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-input
          placeholder="搜索电影、演员"
          v-model="searchWord"
          clearable
          @change="searchMovies"
        >
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="operate" v-if="$store.state.userInfo.account == null">
          <el-link type="primary" @click="$router.push({ name: 'Login' })"
            >登录</el-link
          >
          /
          <el-link type="success" @click="$router.push({ name: 'Register' })"
            >注册</el-link
          >
        </div>
        <div class="avatar" v-else @click="triggleClass">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
          <div class="self" :class="{ self: true, 'self-active': isActive }">
            <el-button @click="$router.push({ name: 'Personal' })"
              >个人中心</el-button
            >
            <el-button @click="logon">退出</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    if (this.$route.meta.name === 'exchange') {
      this.activeIndex = '3'
    }
  },
  data () {
    return {
      searchWord: '',
      isActive: false,
      activeIndex: '1-1'
    }
  },
  methods: {
    // 搜索电影
    searchMovies (kw) {
      this.$router.push({
        path: '/search',
        query: { kw }
      })
    },
    // 退出登录
    logon () {
      this.$store.commit('logon')
      this.$router.push({ name: 'Login' })
    },
    // 切换图像中样式
    triggleClass () {
      this.isActive = !this.isActive
    }
  }
}
</script>
<style lang="less" scoped>
.el-aside {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  border-right: 1px solid #dcdfe6;
}
.index-container {
  padding-left: 200px;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  .el-input-group {
    width: 50%;
    margin-left: 20px;
  }
  .operate,
  .avatar {
    margin-right: 20px;
    cursor: pointer;
  }
  .avatar {
    position: relative;
    width: 100px;
    text-align: center;
    height: auto;
    cursor: pointer;
    .self {
      display: none;
      position: absolute;
      width: 100px;
      z-index: 10;
      .el-button {
        width: 100%;
        border-radius: 0;
        + .el-button {
          margin: 0;
          cursor: pointer;
        }
      }
    }
    .self-active {
      display: block;
    }
  }
}
</style>
