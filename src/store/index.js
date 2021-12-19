import Vue from 'vue'
import Vuex from 'vuex'
import {
  getUserCookie,
  setUserCookie,
  removeUserCookie,
  getManagerCookie,
  setManagerCookie,
  removeManagerCookie
} from '../utils/cookie.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: getUserCookie(),
    managerInfo: getManagerCookie()
  },
  mutations: {
    login (state, userInfo) {
      setUserCookie(userInfo)
      state.userInfo = getUserCookie()
    },
    logon (state) {
      removeUserCookie()
    },
    managerLogin (state, info) {
      setManagerCookie(info)
      state.managerInfo = getManagerCookie()
    },
    managerLogon (state) {
      removeManagerCookie()
    }

  },
  actions: {},
  modules: {}
})
