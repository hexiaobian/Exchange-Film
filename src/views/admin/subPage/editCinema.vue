<template>
  <el-form
    :model="cinemaInfo"
    :rules="rules"
    status-icon
    ref="cinemaInfo"
    label-width="100px"
  >
    <el-form-item label="影院id" prop="id" v-if="disabled">
      <el-input v-model="cinemaInfo.id" :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item label="影院名称" prop="name">
      <el-input v-model="cinemaInfo.name"></el-input>
    </el-form-item>
    <el-form-item label="所在位置" prop="location">
      <el-input v-model="cinemaInfo.location"></el-input>
    </el-form-item>
    <el-form-item label="所在城市" prop="city">
      <el-input v-model="cinemaInfo.city"></el-input>
    </el-form-item>
    <el-form-item label="入网时间" prop="netTime" v-if="disabled">
      <el-input v-model="cinemaInfo.netTime" :disabled="disabled"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('cinemaInfo')"
        :disabled="
          JSON.stringify(cinemaInfo) === JSON.stringify(initCinemaInfo)
        "
        >提交</el-button
      >
      <el-button
        v-if="JSON.stringify(cinemaInfo) === JSON.stringify(initCinemaInfo)"
        @click="$router.push({ name: 'CinemaManager' })"
        >取消</el-button
      >
      <el-button v-else @click="resetForm('cinemaInfo')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { cinema } from '@/api'
import moment from 'moment'

export default {
  created () {
    const { cinemaId } = this.$route.query
    if (cinemaId !== undefined) {
      this.cinemaId = cinemaId
      this.disabled = true
      this.getCinemaInfo(cinemaId)
    }
  },
  data () {
    return {
      disabled: false,
      cinemaId: 0,
      cinemaInfo: {},
      initCinemaInfo: {},
      rules: {
        name: [
          { required: true, message: '请输入影院名称', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入影院所在位置', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入影院所在城市', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取影院详情数据
    getCinemaInfo (id) {
      cinema.getCinemaDetail(id).then(res => {
        if (res.code === 0) {
          let { id, name, city, netTime, location } = res.data
          netTime = moment.utc(netTime).format('YYYY-MM-DD HH:mm:ss')
          this.cinemaInfo = {
            id,
            name,
            city,
            netTime,
            location
          }
          this.initCinemaInfo = JSON.parse(JSON.stringify(this.cinemaInfo))
        }
      })
    },
    // ["张子枫","肖央","朱媛媛","段博文","梁靖康","金遥源","王圣迪","孙嘉灵","陈永胜","朴松日"]
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let result = null
          if (this.cinemaId) {
            result = await cinema.updateCinema(this.cinemaInfo)
          } else {
            result = await cinema.addCinema(this.cinemaInfo)
          }
          if (result.code === 0 && this.cinemaId) {
            this.$message({
              type: 'success',
              message: '修改成功！',
              duration: 1000,
              onClose: () => {
                this.$router.push({ name: 'CinemaManager' })
              }
            })
          } else if (result.code === 0 && !this.cinemaId) {
            this.$message({
              type: 'success',
              message: '新增成功！',
              duration: 1000,
              onClose: () => {
                this.$router.push({ name: 'CinemaManager' })
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: result.msg
            })
          }
        }
      })
    },
    // 重置表单数据
    resetForm (formName) {
      if (this.cinemaId) {
        this.getCinemaInfo(this.cinemaId)
      } else {
        this.$refs[formName].resetFields()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-form {
  width: 60%;
  margin: 20px auto;
}
</style>
