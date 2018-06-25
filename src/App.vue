<template>
  <div id="app" :class="{ 'with-background': this.useBackground() }">
    <app-side-bar v-if="showSideBar" />
    <div class="main-content-wrapper">
      <div class="main-content">
        <router-view />
      </div>
      <app-footer />
    </div>
    <toast-container />
  </div>
</template>

<script>
import axios from 'axios'
import 'freshchat-widget'

import config from './util/config'
import AppSideBar from './components/AppSideBar'
import AppFooter from './components/AppFooter'
import { Web3Errors } from './store/modules/web3'
import ToastContainer from './components/ToastContainer'

import './util/analytics'

export default {
  name: 'App',
  components: {
    AppSideBar,
    AppFooter,
    ToastContainer,
  },
  created() {
    this.initializeApi()

    this.$store.dispatch('registerWeb3', this.$router)
      .then(() => {
        if (this.authToken) {
          this.$store.dispatch('updateUserState', this.authToken)
        }
      })
  },
  data() {

    return {
      routesToHideSideBar: [
        'home',
        'login',
      ],
      freshChatToken: process.env.FRESHCHAT_API_TOKEN,
    }
  },
  computed: {
    showSideBar() {
      // Rather than have to explicitly pass the AppSideBar component for every route,
      //  we just conditionally remove it from a few specific routes here.
      return this.routesToHideSideBar.indexOf(this.$route.name) === -1
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
  height: 100%

body
  font-size: 1em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  font-family: $font-family-sans-serif

#app
  display: flex
  width: 100%

  &.with-background
    background: url(assets/images/pattern-dark.jpeg)

.main-content-wrapper
  display: flex
  flex-direction: column
  min-height: 100vh
  width: 100%
  min-width: 40rem

.main-content
  flex: 1
  width: 100%
  padding: 2rem
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

    &:before
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

      &:before
        left: 32px
        background: $color-success
// End CSS Checkbox toggle
</style>
