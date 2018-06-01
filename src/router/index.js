import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'

import LoginView from '../views/LoginView'
import FeatureListView from '../views/FeatureListView'
import TransferListView from '../views/TransferListView'
import TitleListView from '../views/TitleListView'
import TitleDetailView from '../views/TitleDetailView'
import SettingsView from '../views/SettingsView'
import ManageTokensView from '../views/ManageTokensView'

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
    { name: 'login', path: '/login', component: LoginView, beforeEnter: ifNotAuthenticated, meta: { allowUnauthenticatedUsers: true } },
    { name: 'transfers', path: '/transfers', redirect: '/transfers/incoming' },
    { name: 'incoming-transfers', path: '/transfers/incoming', component: TransferListView, props: { transferDirection: 'incoming' } },
    { name: 'outgoing-transfers', path: '/transfers/outgoing', component: TransferListView, props: { transferDirection: 'outgoing' } },
    { name: 'coming-soon', path: '/coming-soon', component: FeatureListView },
    { name: 'settings', path: '/settings', component: SettingsView },
    { name: 'collection', path: '/collection', component: TitleListView },
    { name: 'manage-tokens', path: '/manage-tokens', component: ManageTokensView },
    { name: 'title-detail', path: '/title/:titleId', component: TitleDetailView, meta: { allowUnauthenticatedUsers: true } },
    { path: '/', redirect: '/collection' },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((route) => { return !route.meta.allowUnauthenticatedUsers })) {
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
