// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueBootstrap from 'bootstrap-vue'
import VueAnalytics from 'vue-analytics'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/custom-bootstrap.scss'

import router from './router'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueBootstrap)

Vue.use(VueAnalytics, {
  id: process.env.GA_ID,
  router,
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
