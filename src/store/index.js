import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.VUE_APP_TARGET_ENV !== 'production',
  modules,
})
