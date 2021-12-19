<template>
  <el-container>
    <el-header>
      <img src="@/assets/logo1.jpg" />
    </el-header>
    <el-main>
      <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="用户名" prop="account" :required="true">
          <el-input
            type="text"
            v-model="loginForm.account"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="true">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('loginForm')"
            >登录</el-button
          >
          <el-button @click="resetForm('loginForm')">重置</el-button>

          <el-button type="text" @click="register" v-if="isUser"
            >注册</el-button
          >
        </el-form-item>
        <div class="choose">
          请选择角色：
          <el-switch
            style="display: block"
            v-model="isUser"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="用户"
            inactive-text="管理员"
            @change="judgeRole"
          >
          </el-switch>
        </div>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { user, manager } from '@/api'
export default {
  data () {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = /[\w\d_]{6,12}/
        if (!reg.test(this.loginForm.password)) {
          callback(new Error('密码必须是字母或数字的组合，且长度是6到12位'))
        } else {
          callback()
        }
      }
    }

    return {
      loginForm: {
        account: '',
        password: ''
        // nickname: ""
      },
      isUser: true,
      rules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 提交信息
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { account, password } = this.loginForm
          let result = null
          if (this.isUser) {
            result = await user.login({ account, password })
            if (result.code === 0) {
              const { account, nickname, id } = result.data
              this.$store.commit('login', { account, nickname, id })
              this.$router.push({ name: 'Index' })
            }
          } else {
            result = await manager.login({ account, password })
            if (result.code === 0) {
              const { account, name, id } = result.data
              this.$store.commit('managerLogin', { account, name, id })
              this.$router.push({ name: 'Statistics' })
            }
          }
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 跳到注册页面
    register () {
      this.$router.push({ name: 'Register' })
    },
    judgeRole (e) {
      this.isUser = e
    }
  }
}
</script>

<style lang="less" scoped>
.el-header {
  height: 76px;
  width: 100%;
  margin-top: 50px;
  text-align: center;
}
.el-main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  .el-form {
    position: relative;
    margin-bottom: 20px;
    .choose {
      position: absolute;
      width: 400px;
      top: 160px;
      left: 50px;
      display: flex;
      z-index: 100;
      .el-switch {
        display: inline-block;
      }
    }
  }
}
</style>
