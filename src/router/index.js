import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/index'
},
{
  path: '/index',
  name: 'Index',
  redirect: '/index/hinting',
  component: () => import('@/views/user/index.vue'),
  children: [{
    path: 'hinting',
    name: 'Hinting',
    component: () => import('@/views/user/components/HintUpcoming.vue'),
    meta: {
      type: 'hinting'
    }
  },
  {
    path: 'upcoming',
    name: 'Upcoming',
    component: () => import('@/views/user/components/HintUpcoming.vue'),
    meta: {
      type: 'upcoming'
    }
  },
  {
    path: 'recommand',
    name: 'Recommand',
    component: () => import('@/views/user/components/Recommands.vue'),
    meta: {
      type: 'recommand'
    }
  },
  {
    path: '/selectBuy',
    name: 'SelectBuy',
    component: () => import('@/views/user/selectBuy.vue')
  },
  {
    path: '/cinema',
    name: 'Cinema',
    component: () => import('@/views/user/cinema.vue')
  },
  {
    path: '/chooseSeat',
    name: 'ChooseSeat',
    component: () => import('@/views/user/buyTickets.vue')
  },
  {
    path: '/ticketsOrder',
    name: 'TicketsOrder',
    component: () => import('@/views/user/ticketsOrder.vue')
  },
  {
    path: '/exchange',
    name: 'Exchange',
    meta: {
      name: 'exchange'
    },
    component: () => import('@/views/user/exchange.vue')
  },
  {
    path: '/exchangeRegion',
    name: 'ExchangeRegion',
    meta: {
      name: 'exchangeRegion'
    },
    component: () => import('@/views/user/exchangeRegion.vue')
  }
  ]
},
{
  path: '/search',
  name: 'Search',
  redirect: to => {
    const {
      params
    } = to
    return {
      name: 'KeyWord',
      params
    }
  },
  component: () => import('@/views/user/searchMovie.vue'),
  children: [{
    path: 'keyword',
    name: 'KeyWord',
    component: () => import('@/views/user/components/SearchByWord.vue')
  },
  {
    path: 'condition',
    name: 'Condition',
    component: () => import('@/views/user/components/Condition.vue')
  },
  {
    path: '/personal',
    name: 'Personal',
    meta: {
      name: 'personal'
    },
    component: () => import('@/views/user/personal.vue')
  },
  {
    path: '/myExchange',
    name: 'MyExchange',
    alias: '/personal/myExchange',
    component: () => import('@/views/user/myExchange.vue')
  },
  {
    path: '/registerMes',
    name: 'RegisterMes',
    meta: {
      name: 'registerMes'
    },
    component: () => import('@/views/user/registerMes.vue')
  },
  {
    path: '/trade',
    name: 'Trade',
    meta: {
      name: 'trade'
    },
    component: () => import('@/views/user/trade.vue')
  },
  {
    path: '/filmDetail',
    name: 'FilmDetail',
    component: () => import('@/views/user/filmDetail.vue')
  }
  ]
},
{
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login.vue')
},
{
  path: '/register',
  name: 'Register',
  component: () => import('@/views/register.vue')
},
{
  path: '/statistics',
  name: 'Statistics',
  component: () => import('@/views/admin/statistics.vue'),
  children: [{
    path: 'userManager',
    name: 'UserManager',
    component: () => import('@/views/admin/userManager.vue')
  },
  {
    path: 'cinemaManager',
    name: 'CinemaManager',
    component: () => import('@/views/admin/cinemaManager.vue')
  },
  {
    path: '/editCinema',
    name: 'EditCinema',
    alias: '/cinemaManager/editCinema',
    component: () => import('@/views/admin/subPage/editCinema.vue')
  },
  {
    path: 'filmManager',
    name: 'FilmManager',
    component: () => import('@/views/admin/filmManager.vue')
  },
  {
    path: 'editFilm',
    name: 'EditFilm',
    alias: '/filmManager/editFilm',
    component: () => import('@/views/admin/subPage/editFilm.vue')
  },
  {
    path: 'exchangeManager',
    name: 'ExchangeManager',
    component: () => import('@/views/admin/exchangeManager.vue')
  },
  {
    path: 'scheduleManager',
    name: 'ScheduleManager',
    component: () => import('@/views/admin/scheduleManager.vue')
  },
  {
    path: 'addSchdule',
    name: 'AddSchdule',
    alias: '/scheduleManager/addSchdule',
    component: () => import('@/views/admin/subPage/addSchdule.vue')
  },
  {
    path: 'editSchedule',
    name: 'EditSchedule',
    alias: '/scheduleManager/editSchedule',
    component: () => import('@/views/admin/subPage/editSchedule.vue')
  },
  {
    path: 'orderManager',
    name: 'OrderManager',
    component: () => import('@/views/admin/orderManager.vue')
  }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: () => {
    history.pushState(null, null, document.URL)
  }
})

router.beforeEach((to, from, next) => {
  if (to.name == 'Hinting' || to.name == 'Upcoming' || to.name == 'Recommand' || to.name == 'Login' || to.name == 'Register') {
    next()
  } else {
    if (store.state.userInfo.account) {
      next()
    } else {
      next({
        name: 'Login'
      })
    }
  }
})

export default router
