import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/common/Login.vue'
import Home from 'views/Home.vue'
import MainHome from 'views/MainHome'
import CreateUser from 'views/CreateUser'

import WzCategory from 'views/wz/WzCategory'
import WzCount from 'views/wz/WzCount'
import WzPurchase from 'views/wz/WzPurchase'
import WzPutStorage from 'views/wz/WzPutStorage'
import WzClaims from 'views/wz/WzClaims'
import WzFinancial from 'views/wz/WzFinancial'

import MapData from 'views/MapData'
import Error from 'views/Error'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  },
  {
    path: '*',
    redirect: '/error'
  },
  {
    path: '/error',
    component: Error
  },
  {
    path: '/home',
    component: Home,
    children: [{
        path: "/",
        component: MainHome
      },
      {
        path: 'createUser',
        component: CreateUser,
      },
      {
        path: 'wzCategory',
        component: WzCategory
      },
      {
        path: 'wzCount',
        component: WzCount
      },
      {
        path: "wzPurchase",
        component: WzPurchase
      },
      {
        path: "warehouseReg",
        component: WzPutStorage
      },
      {
        path: "claims",
        component: WzClaims
      },
      {
        path: "financial",
        component: WzFinancial
      },
      {
        path: "map",
        component: MapData
      }
    ],
  }

]

const router = new VueRouter({
  routes
})


// 添加导航守卫
router.beforeEach((to, from, next)=> {
  const token = localStorage.getItem("token")
  // 没有匹配到路由
  // if (!token && to.path != "/") {
  //   next("/")
  // } else {
    // next()
  // }
  next()
}) 

export default router