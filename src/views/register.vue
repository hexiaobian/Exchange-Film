<template>
  <el-container>
    <el-header>
      <img src="@/assets/logo1.jpg" />
    </el-header>
    <el-main>
      <el-form
        :model="registerForm"
        status-icon
        :rules="rules"
        ref="registerForm"
        label-width="100px"
        size="small"
        :hide-required-asterisk="false"
      >
        <el-form-item label="用户名" prop="account" :required="true">
          <el-input
            type="text"
            v-model="registerForm.account"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="true">
          <el-input
            type="password"
            v-model="registerForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="comfirmPass" :required="true">
          <el-input
            type="password"
            v-model="registerForm.comfirmPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            type="text"
            v-model="registerForm.nickname"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('registerForm')"
            >注册</el-button
          >
          <el-button @click="resetForm('registerForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import { user } from '@/api'
export default {
  data () {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        user.checkUser(value).then(res => {
          if (res.code !== 0) {
            callback(new Error(res.msg))
          } else {
            callback()
          }
        })
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const reg = /[\w\d_]{6,12}/
        if (!reg.test(value)) {
          callback(new Error('密码必须是字母或数字的组合，且长度是6到12位'))
        } else {
          callback()
        }
      }
    }
    var validateComfirmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else {
        if (value !== this.registerForm.password) {
          callback(new Error('两次密码不一致！'))
        } else {
          callback()
        }
      }
    }

    return {
      registerForm: {
        account: '',
        password: '',
        comfirmPass: ''
        // nickname: ""
      },
      rules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        comfirmPass: [{ validator: validateComfirmPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 提交信息
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const {
            account,
            password,
            comfirmPass,
            nickname
          } = this.registerForm
          user
            .register({ account, password, comfirmPass, nickname })
            .then(res => {
              if (res.code === 0) {
                const { account, nickname, id } = res.data
                this.$store.commit('login', { account, nickname, id })
                this.$router.push({ name: 'Index' })
              }
            })
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    register () {
      this.$router.push({ name: 'Register' })
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
  // .el-form {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   width: 500px;
  //   .el-form-item {
  //     display: flex;
  //     margin-top: 20px;
  //   }
  // }
}
</style>
