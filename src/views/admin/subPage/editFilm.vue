<template>
  <el-form :model="filmInfo" ref="filmInfo" label-width="120px" :rules="rules">
    <el-form-item label="影片id" prop="id" v-if="filmId">
      <el-input v-model="filmInfo.id" disabled></el-input>
    </el-form-item>
    <el-form-item label="影片名称" prop="name">
      <el-input v-model="filmInfo.name"></el-input>
    </el-form-item>
    <el-form-item label="时长" prop="duration">
      <el-input v-model="filmInfo.duration"></el-input>
    </el-form-item>
    <el-form-item label="导演" prop="director">
      <el-input v-model="filmInfo.director"></el-input>
    </el-form-item>
    <el-form-item label="影片图片地址" prop="filmImg">
      <el-input v-model="filmInfo.filmImg"></el-input>
    </el-form-item>
    <el-form-item label="上映时间" prop="releaseTime">
      <el-input v-model="filmInfo.releaseTime"></el-input>
    </el-form-item>
    <el-form-item label="角色" prop="role">
      <el-input v-model="filmInfo.role"></el-input>
    </el-form-item>
    <el-form-item label="区域" prop="region">
      <el-input v-model="filmInfo.region"></el-input>
    </el-form-item>
    <el-form-item label="简介" prop="introduction">
      <el-input
        v-model="filmInfo.introduction"
        type="textarea"
        :rows="5"
      ></el-input>
    </el-form-item>
    <el-form-item label="评分" prop="score">
      <el-input v-model="filmInfo.score"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-input v-model="filmInfo.type"></el-input>
    </el-form-item>
    <el-form-item label="类别" prop="category">
      <el-select v-model="filmInfo.category">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="submitForm('filmInfo')"
        :disabled="JSON.stringify(filmInfo) === JSON.stringify(initFilmInfo)"
        >提交</el-button
      >
      <el-button
        v-if="JSON.stringify(filmInfo) === JSON.stringify(initFilmInfo)"
        @click="$router.push({ name: 'FilmManager' })"
        >取消</el-button
      >
      <el-button v-else @click="resetForm('filmInfo')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { film } from '@/api'
export default {
  created () {
    const { filmId } = this.$route.query
    if (filmId) {
      this.filmId = filmId
      this.getFilmInfo(filmId)
    }
  },
  data () {
    return {
      filmId: 0,
      initFilmInfo: {},
      filmInfo: {},
      options: [
        { label: '正在热映', value: 'hinting' },
        { label: '即将上映', value: 'upcoming' },
        { label: '热点推荐', value: 'recommand' }
      ],
      rules: {
        name: [{ required: true, message: '请输入影院名称', trigger: 'blur' }],
        duration: [
          { required: true, message: '请输入影片时长', trigger: 'blur' }
        ],
        director: [{ required: true, message: '请输入导演', trigger: 'blur' }],
        filmImg: [
          { required: true, message: '请输入影片图片地址', trigger: 'blur' }
        ],
        releaseTime: [
          { required: true, message: '请输入影片上映时间', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请输入影片上映地址', trigger: 'blur' }
        ],
        city: [
          { required: true, message: '请输入影院所在城市', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getFilmInfo (id) {
      film.getDetail(id).then(res => {
        if (res.code === 0) {
          this.initFilmInfo = JSON.parse(JSON.stringify(res.data))
          this.filmInfo = res.data
        }
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let result = null
          if (this.filmId) {
            result = await film.updateFilm(this.filmInfo)
          } else {
            result = await film.addFilm(this.filmInfo)
          }
          let message = ''
          if (result.code === 0) {
            if (this.filmId) {
              message = '修改成功！'
            } else if (!this.filmId) {
              message = '新增成功！'
            }
            this.$message({
              type: 'success',
              message: message,
              duration: 1000,
              onClose: () => {
                this.$router.push({ name: 'FilmManager' })
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
    resetForm (formName) {
      if (this.filmId) {
        this.getFilmInfo(this.filmId)
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
