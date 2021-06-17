import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 引入element

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)

// 挂载全局css样式重置文件
import 'assets/styles/reset.css'
import 'assets/styles/common.css'

// 使用echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

// 使用json-excel
import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)

// 使用axios
// import { http } from './http.js'
// Vue.prototype.$http = http
import axios from 'axios'
Vue.prototype.$http = axios
// axios.defaults.baseURL = '/api'

Vue.config.productionTip = false

Vue.filter('transformTime', function (dateStr, pattern = '') {
  var dt = new Date(dateStr)
  var yy = dt.getFullYear()
  // 方法二
  // ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
  var mm = (dt.getMonth() + 1).toString().padStart(2, '0')
  var dd = dt.getDate().toString().padStart(2, '0')
  var h = dt.getHours().toString().padStart(2, '0')
  var m = dt.getMinutes().toString().padStart(2, '0')
  var s = dt.getSeconds().toString().padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
      return yy + '-' + mm + '-' + dd
  } else {
      return yy + '-' + mm + '-' + dd
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')