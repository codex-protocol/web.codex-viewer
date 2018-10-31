<template>
  <div>
    <AppWarningBanner v-if="showWarningBanner" />
    <div id="app" :class="{
      'with-background': this.useBackgroundImage(),
      'show-nav': showNav,
    }">
      <template v-if="!hideSideBar">
        <span class="hamburger" @click="toggleNav">
          <IconBase
            iconName="menu"
            width="28"
            height="32"
            class="icon-menu"
          />
        </span>
        <AppSideBar :hideNav="hideNav" />
      </template>
      <div class="main-content-wrapper">
        <div class="main-content">
          <router-view :key="$route.fullPath" v-if="isLoaded" />
          <LoadingOverlay type="global" v-else />
        </div>
        <AppFooter />
      </div>
      <ToastContainer />
      <vue-cookie-accept-decline disableDecline>
        <div slot="message">
          This website stores cookies on your computer. Cookies are used to save information about how you interact with our website and allow us to remember you when you return. We never sell this information, and we use it strictly for analytics and metrics. For more information, please see our <a href="https://www.codexprotocol.com/privacy-policy.html" target="_blank">Privacy Policy.</a>
        </div>
      </vue-cookie-accept-decline>
    </div>
  </div>
</template>

<script>

import 'freshchat-widget'
import axios from 'axios'
import {
  mapState,
  mapGetters,
} from 'vuex'
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'

import config from './util/config'
import EventBus from './util/eventBus'

import AppFooter from './components/core/AppFooter'
import AppSideBar from './components/core/AppSideBar'
import AppWarningBanner from './components/core/AppWarningBanner'

import IconBase from './components/icons/IconBase'
import LoadingOverlay from './components/util/LoadingOverlay'
import ToastContainer from './components/util/ToastContainer'
import PartyModeActivator from './directives/PartyModeActivator'

import './util/analytics'

export default {
  name: 'App',

  components: {
    VueCookieAcceptDecline,

    AppFooter,
    AppSideBar,
    AppWarningBanner,

    IconBase,
    LoadingOverlay,
    ToastContainer,
  },

  directives: {
    PartyModeActivator,
  },

  data() {
    return {
      showNav: false,
      showWarningBanner: config.expectedNetworkId !== '1' && config.expectedNetworkId !== '5777',
    }
  },

  created() {
    this.initializeApi()

    this.$store.dispatch('app/FETCH_VERIFIED_USERS')

    EventBus.$on('socket:codex-coin:transferred', () => {
      this.$store.dispatch('auth/FETCH_TOKEN_BALANCE')
    })

    EventBus.$on('socket:codex-coin:registry-contract-approved', () => {
      this.$store.dispatch('auth/FETCH_APPROVAL_STATUSES')
    })
  },

  mounted() {
    const setIsLoaded = () => {
      this.$store.commit('app/SET_IS_LOADED', { isLoaded: true })
    }

    const { query } = this.$route
    const authToken = query.authToken || this.authToken

    if (authToken) {
      this.$store.dispatch('auth/LOGIN_FROM_CACHED_TOKEN', authToken)
        .then(() => {
          if (this.$route.meta.ifAuthenticatedRedirectTo) {
            this.$router.replace({ name: this.$route.meta.ifAuthenticatedRedirectTo })
          } else {
            setIsLoaded()
          }
        })
        .catch(setIsLoaded)
    } else {
      setIsLoaded()
    }
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-coin:transferred')
    EventBus.$off('socket:codex-coin:registry-contract-approved')
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapState('app', ['isLoaded']),
    ...mapState('auth', ['user', 'authToken']),

    hideSideBar() {
      return this.$route.meta && this.$route.meta.hideSideBar
    },

    recordId() {
      return this.$route.params.recordId
    },
  },

  watch: {
    $route(newRoute, oldRoute) {
      if (!this.isLoaded) {
        // If the route changes as a result of authentication (e.g., /login to /collection)
        //  then we only mark loading complete after the new route has been loaded
        this.$store.commit('app/SET_IS_LOADED', {
          isLoaded: true,
        })
      }
    },
  },

  methods: {
    initializeApi() {
      axios.defaults.baseURL = config.apiUrl
      axios.defaults.headers.common['Content-Type'] = 'application/json'

      const authErrorHandler = (error) => {
        if (error.response && error.response.status === 401) {
          this.$store.dispatch('auth/LOGOUT_USER')
        }

        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
          throw new Error(error.response.data.error.message)
        }

        throw error
      }

      axios.interceptors.response.use(
        (response) => { return response }, // @NOTE: use a no-op here since we're only interested in intercepting errors
        authErrorHandler
      )
    },

    useBackgroundImage() {
      return this.$route.meta.useBackgroundImage || false
    },

    toggleNav() {
      this.showNav = !this.showNav
    },

    hideNav() {
      this.showNav = false
    },
  },
}
</script>

<style lang="stylus">

@import "./assets/variables.styl"

html
  font-size 16px

html
body
  margin: 0
  padding: 0
  width: 100%

body
  font-size: 1em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  font-family: $font-family-sans-serif

// this will properly rotate images with EXIF data (i.e. photos taken on a
//  phone) in FireFox - unfortunately it doesn't work in Chrome, so such images
//  can't be properly rotated without significant effor ¯\_(ツ)_/¯
img
  image-orientation: from-image

#app
  width: 100%
  display: flex
  background-color: $color-dark

  &.with-background
    background-image: url(assets/images/pattern-dark.jpeg)

  // On smaller screens, handle the toggle of showing the side menu
  &.show-nav

    nav
      display: flex

    .main-content-wrapper
      display: none

    // On larger screens always show the side menu and content
    @media screen and (min-width: $breakpoint-md)
      nav
      .main-content-wrapper
        display: flex

.hamburger
  color: $color-primary
  position: fixed
  right: 20px
  top: 10px
  z-index: 10
  padding: 10px
  cursor: pointer

  @media screen and (min-width: $breakpoint-md)
    display: none

.main-content-wrapper
  width: 100%
  display: flex
  min-height: 100vh
  flex-direction: column
  padding-bottom: $bottom-nav-height

.main-content
  flex: 1
  width: 100%
  overflow: auto

.cookie
  color: $color-dark
  padding: 2rem !important
  z-index: 2147483601 !important // freshchat sets their button's z-index to 2147483600 lol
  background-color: $color-light !important

  a
    font-weight: 700
    color: $color-secondary

  button
    background-color: lighten($color-secondary, 25%) !important

.alert a
  color: inherit
  font-weight: 600

// CSS Checkbox toggle
// <input type="checkbox"> toggle
// https://danklammer.com/articles/simple-css-toggle-switch/
.toggle-checkbox
  opacity: 1
  z-index: 0
  -webkit-appearance: none
  appearance: none
  width: 62px
  height: 32px
  display: inline-block
  position: relative
  border-radius: 50px
  overflow: hidden
  outline: none
  border: 3px solid $color-gray
  cursor: pointer
  background-color: transparent
  transition: border-color ease 0.3s

  &::before
    content: ""
    display: block
    position: absolute
    z-index: 2
    width: 22px
    height: 22px
    background: $color-gray
    left: 2px
    top: 2px
    border-radius: 50%
    font: 10px/28px Helvetica
    text-transform: uppercase
    font-weight: bold
    text-indent: -22px
    word-spacing: 37px
    color: $color-light
    text-shadow: -1px -1px rgba(0,0,0,0.15)
    white-space: nowrap
    box-shadow: 0 1px 2px rgba(0,0,0,0.2)
    transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s

  &:checked
    background-color: transparent
    border-color: $color-success

    &::before
      left: 32px
      background: $color-success
// End CSS Checkbox toggle
</style>
