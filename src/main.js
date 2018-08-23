// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import VueBootstrap from 'bootstrap-vue'
import VueAnalytics from 'vue-analytics'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/custom-bootstrap.scss'

import router from './router'
import App from './App'
import store from './store'

if (process.env.VUE_APP_SENTRY_DSN) {
  Raven
    .config(process.env.VUE_APP_SENTRY_DSN, {
      environment: process.env.VUE_APP_TARGET_ENV,
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false
Vue.use(VueBootstrap)

let googleId
switch (process.env.VUE_APP_TARGET_ENV) {
  case 'production':
    googleId = process.env.VUE_APP_PRODUCTION_GA_ID
    break

  case 'staging':
    googleId = process.env.VUE_APP_STAGING_GA_ID
    break

  default:
    googleId = false
    break
}

if (googleId) {
  Vue.use(VueAnalytics, {
    id: googleId,
    router,
  })
}


// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  render: (h) => { return h(App) },
}).$mount('#app')
