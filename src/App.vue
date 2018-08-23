<template>
  <div id="app" :class="{
    'with-background': this.useBackground(),
    'show-nav': showNav,
  }">
    <span v-if="!hideSideBar" class="hamburger" @click="toggleNav">
      <icon-base
        iconName="menu"
        width="28"
        height="32"
        class="icon-menu"
      >
        <icon-hamburger />
      </icon-base>
    </span>
    <app-side-bar v-if="!hideSideBar" :hideNav="hideNav" />
    <div class="main-content-wrapper">
      <div class="main-content">
        <router-view v-if="web3.isLoaded" />
        <loading-overlay type="global" v-else />
      </div>
      <app-footer />
    </div>
    <toast-container />
  </div>
</template>

<script>

import 'freshchat-widget'
import axios from 'axios'

import config from './util/config'
import EventBus from './util/eventBus'

import { Web3Errors } from './store/modules/web3'

import AppFooter from './components/AppFooter'
import AppSideBar from './components/AppSideBar'
import IconBase from './components/icons/IconBase'
import LoadingOverlay from './components/LoadingOverlay'
import ToastContainer from './components/ToastContainer'
import IconHamburger from './components/icons/IconHamburger'

import './util/analytics'

export default {
  name: 'App',
  components: {
    IconBase,
    AppFooter,
    AppSideBar,
    IconHamburger,
    ToastContainer,
    LoadingOverlay,
  },
  created() {

    this.initializeApi()

    this.$store.dispatch('registerWeb3', this.$router)
      .then(() => {

        // @TODO: evaluate what happens when a bogus auth token is set in the
        //  route params
        if (this.$route.query.authToken) {
          this.$store.dispatch('updateUserState', this.$route.query.authToken)
            .then(() => {

              const query = Object.assign({}, this.$route.query)
              delete query.authToken

              return this.$router.replace({
                name: this.$route.meta.ifAuthenticatedRedirectTo || this.$route.name,
                query,
              })
            })
        } else if (this.authToken) {
          this.$store.dispatch('updateUserState', this.authToken)
        }

        EventBus.$on('socket:codex-coin:transferred', () => {
          this.$store.dispatch('updateUserState')
        })

        EventBus.$on('socket:codex-coin:registry-contract-approved', () => {
          this.$store.dispatch('updateUserState')
        })
      })
  },
  data() {
    return {
      freshChatToken: process.env.VUE_APP_FRESHCHAT_API_TOKEN,
      showNav: false,
    }
  },
  computed: {
    hideSideBar() {
      return this.$route.meta && this.$route.meta.hideSideBar
    },
    user() {
      return this.$store.state.auth.user
    },
    authToken() {
      return this.$store.state.auth.authToken
    },
    recordId() {
      return this.$route.params.recordId
    },
    web3() {
      return this.$store.state.web3
    },
    web3Error() {
      return this.$store.state.web3.error
    },
  },
  methods: {
    initializeApi() {
      axios.defaults.baseURL = config.apiUrl
      axios.defaults.headers.common['Content-Type'] = 'application/json'

      const authErrorHandler = (error) => {
        if (error.response && error.response.status === 401) {
          this.$store.dispatch('logout', this.$router)
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
    useBackground() {
      switch (this.$route.name) {
        case 'login':
        case 'home':
          return true
        default:
          return false
      }
    },
    toggleNav() {
      this.showNav = !this.showNav
    },
    hideNav() {
      this.showNav = false
    },
  },
  watch: {
    web3Error(error) {
      // MetaMask has been locked while logged in
      //  Logout the user
      if (Web3Errors.Locked && this.authToken) {
        this.$store.dispatch('logout', this.$router)
      }
    },
  },
  mounted() {
    const token = this.freshChatToken
    if (token) {
      window.fcWidget.init({
        token,
        host: 'https://wchat.freshchat.com',
      })
    }
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
