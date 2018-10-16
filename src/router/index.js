import Vue from 'vue'
import Router from 'vue-router'

import store from '../store'
import config from '../util/config'

import LoginView from '../views/LoginView'
import ConfirmEmailView from '../views/ConfirmEmailView'
import FeatureListView from '../views/FeatureListView'
import TransferListView from '../views/TransferListView'
import RecordListView from '../views/RecordListView'
import RecordDetailView from '../views/RecordDetailView'
import SettingsView from '../views/SettingsView'
import ManageTokensView from '../views/ManageTokensView'
import FaucetView from '../views/FaucetView'
import GalleryView from '../views/GalleryView'
import GalleryListView from '../views/GalleryListView'
import OAuth2AppView from '../views/test/OAuth2AppView'

Vue.use(Router)

const router = new Router({
  routes: [

    // login routes
    {
      name: 'login',
      path: '/login',
      alias: '/',
      component: LoginView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        allowUnauthenticatedUsers: true,
        ifAuthenticatedRedirectTo: 'collection',
      },
    },
    {
      name: 'confirm-email',
      path: '/confirm-email',
      component: ConfirmEmailView,
      meta: {
        hideSideBar: true,
        useBackgroundImage: true,
        allowUnauthenticatedUsers: true,
        ifAuthenticatedRedirectTo: 'collection',
      },
    },

    // main application routes
    {
      name: 'settings',
      path: '/settings',
      component: SettingsView,
    },
    {
      name: 'collection',
      path: '/collection',
      component: RecordListView,
    },
    {
      name: 'record-detail',
      path: '/record/:recordId',
      component: RecordDetailView,
      meta: {
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'transfers',
      path: '/transfers',
      redirect: '/transfers/incoming',
    },
    {
      name: 'incoming-transfers',
      path: '/transfers/incoming',
      component: TransferListView,
      props: {
        transferDirection: 'incoming',
      },
    },
    {
      name: 'outgoing-transfers',
      path: '/transfers/outgoing',
      component: TransferListView,
      props: {
        transferDirection: 'outgoing',
      },
    },

    // gallery routes
    {
      name: 'galleries',
      path: '/galleries',
      component: GalleryListView,
      meta: { allowUnauthenticatedUsers: true },
    },
    {
      name: 'gallery',
      path: '/galleries/:galleryShareCode',
      component: GalleryView,
      meta: { allowUnauthenticatedUsers: true },
    },

    // other non-application routes
    {
      name: 'extensions',
      path: '/extensions',
      component: FeatureListView,
    },

    // test routes (development only)
    {
      name: 'test-oauth2-app',
      path: '/test/oauth2-app',
      component: OAuth2AppView,
    },
  ],
})

if (config.showFaucet) {
  router.addRoutes([
    { name: 'faucet', path: '/faucet', component: FaucetView, meta: { allowUnauthenticatedUsers: true } },
  ])
}

if (config.showManageTokensPage) {
  router.addRoutes([
    { name: 'manage-tokens', path: '/manage-tokens', component: ManageTokensView },
  ])
}

router.beforeEach((to, from, next) => {

  if (to.meta.ifAuthenticatedRedirectTo && store.getters['auth/isAuthenticated']) {
    return next({ name: to.meta.ifAuthenticatedRedirectTo })
  }

  const requireAuthentication = to.matched.some((route) => {
    return !route.meta.allowUnauthenticatedUsers
  })

  // if no route was matched (i.e. a 404)
  // or if the user is trying to access an authenticated page but is unauthenticated
  // then send them to the login page
  if (to.matched.length === 0
    || (requireAuthentication && !store.getters['auth/isAuthenticated'])) {
    return next({ name: 'login' })
  }

  return next()

})

export default router
