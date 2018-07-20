import Vue from 'vue'
import is from 'is_js'
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
import GalleryListView from '../views/GalleryListView'
import UnsupportedDeviceView from '../views/UnsupportedDeviceView'
import UnsupportedBrowserView from '../views/UnsupportedBrowserView'

Vue.use(Router)

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next('/collection')
  } else {
    next()
  }
}

const router = new Router({
  routes: [

    // home & login routes
    {
      name: 'home',
      path: '/',
      component: HomeView,
      meta: {
        hideSideBar: true,
        allowUnauthenticatedUsers: true,
      },
    },
    {
      name: 'login',
      path: '/login',
      component: LoginView,
      beforeEnter: ifAuthenticated,
      meta: {
        hideSideBar: true,
        allowUnauthenticatedUsers: true,
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
    { name: 'galleries', path: '/galleries', component: GalleryListView, meta: { allowUnauthenticatedUsers: true } },
    { name: 'gallery', path: '/galleries/:galleryShareCode', component: GalleryView, meta: { allowUnauthenticatedUsers: true } },

    // other non-application routes
    // @TODO: Deprecate /coming-soon after /extensions has shipped
    {
      name: 'coming-soon',
      path: '/coming-soon',
      component: FeatureListView,
    },
    {
      name: 'extensions',
      path: '/extensions',
      component: FeatureListView,
    },

    // global error routes
    //
    // @TODO: abstract these error pages into common ErrorView component that's
    //  simply passed an errorType prop (e.g. 'unsupported-device' or
    //  'unsupported-browser')?
    {
      name: 'unsupported-device',
      path: '/error/unsupported-device',
      component: UnsupportedDeviceView,
      meta: {
        allowUnauthenticatedUsers: true,
        hideSideBar: true,
      },
    },
    {
      name: 'unsupported-browser',
      path: '/error/unsupported-browser',
      component: UnsupportedBrowserView,
      meta: {
        allowUnauthenticatedUsers: true,
        hideSideBar: true,
      },
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

if (config.showCodexQuestsMarketing) {
  router.addRoutes([
    { name: 'codex-quests', path: '/codex-quests', component: CodexQuestsView, meta: { allowUnauthenticatedUsers: true } },
  ])
}

router.beforeEach((to, from, next) => {

  // we need to check if we've already been redirected to an error page,
  //  otherwise navigating to an error page will result in an endless loop
  const isErrorPage = /^\/error\//.test(to.path)

  const requireAuthentication = to.matched.some((route) => {
    return !route.meta.allowUnauthenticatedUsers
  })

  if (!isErrorPage) {
    // @TODO: move this logic to the login page instead?
    // @NOTE: is.chrome() is true in the Brave browser since it's Chromium-based
    if (requireAuthentication && is.desktop() && !is.firefox() && !is.chrome() && !is.opera()) {
      return next('/error/unsupported-browser')
    }
  }

  // if no route was matched (i.e. a 404), send them to the homepage
  if (to.matched.length === 0) {
    return next('/')
  }

  if (requireAuthentication && !store.getters.isAuthenticated) {
    return next('/login')
  }

  return next()

})

export default router
