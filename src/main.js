// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Raven from 'raven-js'
import { sync } from 'vuex-router-sync'
import VueBootstrap from 'bootstrap-vue'
import VueAnalytics from 'vue-analytics'
import RavenVue from 'raven-js/plugins/vue'

import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/custom-bootstrap.scss'

import App from './App'
import store from './store'
import router from './router'
import config from './util/config'

sync(store, router)

if (process.env.VUE_APP_SENTRY_DSN) {
  Raven
    .config(process.env.VUE_APP_SENTRY_DSN, {
      environment: `${process.env.VUE_APP_TARGET_ENV}-${config.expectedNetworkName}`,
    })
    .addPlugin(RavenVue, Vue)
    .install()
}

Vue.config.productionTip = false
Vue.use(VueBootstrap)

if (process.env.VUE_APP_GOOGLE_ANALYTICS_ID) {
  Vue.use(VueAnalytics, {
    id: process.env.VUE_APP_GOOGLE_ANALYTICS_ID,
    router,
  })
}


// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  render: (h) => { return h(App) },
}).$mount('#app')
