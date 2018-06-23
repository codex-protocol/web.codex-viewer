import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import config from '../util/config'

import HomeView from '../views/HomeView'
import LoginView from '../views/LoginView'
import FeatureListView from '../views/FeatureListView'
import TransferListView from '../views/TransferListView'
import RecordListView from '../views/RecordListView'
import RecordDetailView from '../views/RecordDetailView'
import SettingsView from '../views/SettingsView'
import ManageTokensView from '../views/ManageTokensView'
import CodexQuestsView from '../views/CodexQuestsView'
import FaucetView from '../views/FaucetView'
import GalleryView from '../views/GalleryView'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/collection')
  } else {
    next()
  }
}

// @TODO: Add some logic to catch unhandled routes and redirect them to / or show some error

const router = new Router({
  routes: [
    { name: 'home', path: '/', component: HomeView, meta: { allowUnauthenticatedUsers: true } },
    { name: 'login', path: '/login', component: LoginView, beforeEnter: ifAuthenticated, meta: { allowUnauthenticatedUsers: true } },

    { name: 'transfers', path: '/transfers', redirect: '/transfers/incoming' },
    { name: 'incoming-transfers', path: '/transfers/incoming', component: TransferListView, props: { transferDirection: 'incoming' } },
    { name: 'outgoing-transfers', path: '/transfers/outgoing', component: TransferListView, props: { transferDirection: 'outgoing' } },

    // @TODO: Deprecate /coming-soon after /extensions has shipped
    { name: 'coming-soon', path: '/coming-soon', component: FeatureListView },
    { name: 'extensions', path: '/extensions', component: FeatureListView },

    { name: 'settings', path: '/settings', component: SettingsView },
    { name: 'collection', path: '/collection', component: RecordListView },

    { name: 'record-detail', path: '/record/:recordId', component: RecordDetailView, meta: { allowUnauthenticatedUsers: true } },
  ],
})

if (config.showManageTokensPage) {
  router.addRoutes([
    { name: 'manage-tokens', path: '/manage-tokens', component: ManageTokensView },
    { name: 'faucet', path: '/faucet', component: FaucetView },
  ])
}

if (config.showCodexQuestsMarketing) {
  router.addRoutes([
    { name: 'codex-quests', path: '/codex-quests', component: CodexQuestsView, meta: { allowUnauthenticatedUsers: true } },
    { name: 'gallery', path: '/gallery', component: GalleryView, meta: { allowUnauthenticatedUsers: true } },
  ])
}

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
