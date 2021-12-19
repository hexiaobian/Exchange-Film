<template>
  <el-form
    :model="scheduleForm"
    status-icon
    ref="scheduleForm"
    label-width="100px"
  >
    <el-form-item label="id" prop="id">
      <el-input
        type="text"
        v-model="scheduleForm.id"
        autocomplete="off"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="影片id" prop="filmId">
      <el-input
        type="text"
        v-model="scheduleForm.filmId"
        autocomplete="off"
        disabled
      ></el-input>
    </el-form-item>
    <el-form-item label="影片名字" prop="filmName">
      <el-input v-model="scheduleForm.filmName" disabled></el-input>
    </el-form-item>
    <el-form-item label="影院id" prop="cinemaId">
      <el-input v-model="scheduleForm.cinemaId" disabled></el-input>
    </el-form-item>
    <el-form-item label="影院名字" prop="cinemaName">
      <el-input v-model="scheduleForm.cinemaName" disabled></el-input>
    </el-form-item>
    <el-form-item label="排片时间" prop="schedule">
      <el-date-picker
        v-model="scheduleForm.schedule"
        type="datetime"
        placeholder="选择日期时间"
        :default-value="scheduleForm.schedule"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input v-model.number="scheduleForm.price"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="confirmSchedule('scheduleForm')"
        >提交</el-button
      >
      <el-button @click="cancelSchedule('scheduleForm')">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { schedule as scheduleApi } from '@/api'

export default {
  created () {
    this.scheduleForm = this.$route.query
  },
  data () {
    return {
      scheduleForm: {},
      pickerOptions: {
        disabledDate: date => {
          if (+new Date(date) < +new Date().setHours(0, 0, 0, 0)) {
            return true
          }
          if (new Date(date) > new Date().setHours(0, 0, 0, 0) + 86400000 * 2) {
            return true
          }
        }
      }
    }
  },
  methods: {
    // 确认排片
    confirmSchedule () {
      const { id, filmId, cinemaId, schedule, price } = this.scheduleForm
      const params = {
        id: this.scheduleForm.id,
        scheduleObj: {
          id,
          filmId,
          cinemaId,
          schedule,
          price
        }
      }
      scheduleApi.updateSchedule(params).then(res => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功！',
            duration: 1000,
            onClose: () => {
              this.$router.push({ name: 'ScheduleManager' })
            }
          })
        } else {
          this.scheduleForm.schedule = new Date()
          this.$message({
            type: 'error',
            message: res.msg,
            duration: 1000
          })
        }
      })
    },
    // 取消排片
    cancelSchedule (formName) {
      this.$router.push({ name: 'ScheduleManager' })
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
