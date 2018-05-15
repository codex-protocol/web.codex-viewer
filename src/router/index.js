import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

import LoginView from '../views/LoginView'
import FeatureListView from '../views/FeatureListView'
import TransferListView from '../views/TransferListView'
import TitleListView from '../views/TitleListView'
import TitleDetailView from '../views/TitleDetailView'
import SettingsView from '../views/SettingsView'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

// TODO: Add some logic to catch unhandled routes and redirect them to / or show some error

const router = new Router({
  routes: [
    { name: 'login', path: '/login', component: LoginView, beforeEnter: ifNotAuthenticated },
    { name: 'transfers', path: '/transfers', redirect: '/transfers/incoming', meta: { requiresAuth: true } },
    { name: 'incoming-transfers', path: '/transfers/incoming', component: TransferListView, props: { transferDirection: 'incoming' }, meta: { requiresAuth: true } },
    { name: 'outgoing-transfers', path: '/transfers/outgoing', component: TransferListView, props: { transferDirection: 'outgoing' }, meta: { requiresAuth: true } },
    { name: 'coming-soon', path: '/coming-soon', component: FeatureListView, meta: { requiresAuth: true } },
    { name: 'settings', path: '/settings', component: SettingsView, meta: { requiresAuth: true } },
    { name: 'collection', path: '/collection', component: TitleListView, meta: { requiresAuth: true } },
    { name: 'title-detail', path: '/title/:titleId', component: TitleDetailView },
    { path: '/', redirect: '/collection' },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => { return record.meta.requiresAuth })) {
    if (!store.getters.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
