<template>
  <div class="schedule">
    <div class="filter">
      <div class="film">
        <span>影片名字:</span>
        <el-autocomplete
          placeholder="请输入影片名字"
          value-key="name"
          v-model="selectedFilm"
          :fetch-suggestions="queryFilmAsync"
          :trigger-on-focus="false"
          :select-when-unmatched="true"
          @select="handleSelectFilm"
        ></el-autocomplete>
      </div>
      <div class="cinema">
        <span>影院名字:</span>
        <el-autocomplete
          placeholder="请输入影院名字"
          value-key="name"
          v-model="selectedCinema"
          :trigger-on-focus="false"
          :fetch-suggestions="queryCinemaAsync"
          :select-when-unmatched="true"
          @select="handleSelectCinema"
        ></el-autocomplete>
      </div>
      <div class="date">
        <span>日期时间:</span>
        <el-date-picker
          v-model="datetime"
          type="datetime"
          placeholder="选择日期时间"
          @change="handleSelectDatetime"
        >
        </el-date-picker>
      </div>
      <div class="delete">
        <el-button @click="bulkDelete">批量删除</el-button>
      </div>
    </div>
    <el-table
      :data="scheduleData"
      style="width: 100%"
      @selection-change="selectSome"
    >
      <el-table-column type="selection" width="50"> </el-table-column>
      <el-table-column prop="id" label="id"> </el-table-column>
      <el-table-column prop="filmId" label="影片id" width="80">
      </el-table-column>
      <el-table-column prop="filmName" label="影片名字"> </el-table-column>
      <el-table-column prop="cinemaId" label="影院id" width="80">
      </el-table-column>
      <el-table-column prop="cinemaName" label="影院名字"> </el-table-column>
      <el-table-column prop="schedule" label="排片时间"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="editSchedule(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button @click="deleteSchedule(scope.row)" type="text" size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      @current-change="getMore"
    >
    </el-pagination>
  </div>
</template>

<script>
import { schedule, film, cinema } from '@/api'
import moment from 'moment'
export default {
  created () {
    this.findBySearch()
  },
  data () {
    return {
      scheduleData: [],
      total: 0,
      currentPage: 1,
      selectedFilm: '',
      selectedCinema: '',
      datetime: '',
      searchObj: {},
      selectedSchedules: []
    }
  },
  methods: {
    // 获取所有排片数据
    findBySearch () {
      const params = {
        page: this.currentPage,
        size: 10,
        searchObj: this.searchObj
      }
      schedule.findBySearch(params).then(res => {
        if (res.code === 0) {
          this.scheduleData = res.data.data.map(s => {
            s.schedule = moment(new Date(s.schedule)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            return s
          })
          this.total = res.data.count
        }
      })
    },
    // 分页获取数据
    getMore (page) {
      this.currentPage = page
      this.findBySearch()
    },
    // 编辑排片信息
    editSchedule (row) {
      this.$router.push({
        path: '/scheduleManager/editSchedule',
        query: row
      })
    },
    // 删除排片信息
    deleteSchedule (row) {
      this.$confirm('此操作将永久删除该排片记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          schedule.deleteSchedule(row.id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功！',
                duration: 1000,
                onClose: () => {
                  this.findBySearch()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 搜索影片
    queryFilmAsync (queryFilm, cb) {
      film.getAllFilms().then(res => {
        if (res.code === 0) {
          const allFilm = res.data
          const allFilmResults = queryFilm
            ? allFilm.filter(this.filterResult(queryFilm))
            : allFilm
          cb(allFilmResults)
        }
      })
    },
    // 搜索影院
    queryCinemaAsync (queryCinema, cb) {
      cinema.getAllCinemas().then(res => {
        if (res.code === 0) {
          const allCinema = res.data
          const allCinemaResults = queryCinema
            ? allCinema.filter(this.filterResult(queryCinema))
            : allCinema
          cb(allCinemaResults)
        }
      })
    },
    // 筛选
    filterResult (queryString) {
      return item => {
        return item.name.indexOf(queryString) > -1
      }
    },
    // 远程搜索影片
    handleSelectFilm (film) {
      this.searchObj.filmId = film.id
      this.findBySearch()
    },
    // 远程搜索影院
    handleSelectCinema (cinema) {
      this.searchObj.cinemaId = cinema.id
      this.findBySearch()
    },
    // 选择时间
    handleSelectDatetime (datetime) {
      if (datetime == null) {
        datetime = undefined
      }
      this.searchObj.datetime = datetime
      this.findBySearch()
    },
    // 选择表格数据
    selectSome (data) {
      this.selectedSchedules = data
    },
    // 批量删除
    bulkDelete () {
      this.$confirm('此操作将永久已选的排片信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const proms = this.selectedSchedules.map(s => {
            return schedule.deleteSchedule(s.id)
          })
          Promise.all(proms).then(res => {
            if (res.filter(r => r.code !== 0).length > 0) {
              this.$message({
                type: 'error',
                message: '未知错误，请重试！'
              })
            } else {
              this.$message({
                type: 'success',
                message: '删除成功！',
                duration: 1000,
                onClose: () => {
                  this.findBySearch()
                }
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style lang="less" scoped>
.filter {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 90px;
  span {
    margin-right: 10px;
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
