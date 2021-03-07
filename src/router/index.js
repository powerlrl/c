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
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Login
  }, 
  {
    path: '/home',
    component: Home,
    children: [
      {
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
      }
    ],
  }
  
]

const router = new VueRouter({
  routes
})

export default router
