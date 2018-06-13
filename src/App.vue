<template>
  <div id="app">
    <app-side-bar v-if="authToken" />
    <div class="main-content" :class="{ 'with-background': this.useBackground() }">
      <router-view />
    </div>
    <toast-container />
  </div>
</template>

<script>
import axios from 'axios'

import { apiUrl } from './util/config'
import AppSideBar from './components/AppSideBar'
import { Web3Errors } from './store/modules/web3'
import ToastContainer from './components/ToastContainer'

import analytics from './util/analytics' // eslint-disable-line no-unused-vars

export default {
  name: 'App',
  components: {
    AppSideBar,
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
  computed: {
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
      axios.defaults.baseURL = apiUrl
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
        (response) => { return response }, // NOTE: use a no-op here since we're only interested in intercepting errors
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
      //  Clear user data and reload to hit router auth rules
      if (Web3Errors.Locked && this.authToken) {
        this.$store.dispatch('logoutInPlace', this.$router)
        window.location.reload(true)
      }
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
  height: 100%

body
  font-size: 1em
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  font-family: $font-family-sans-serif

#app
  width: 100%
  height: 100%
  display: flex

.main-content
  width: 100%
  height: 100%
  flex-grow: 1
  padding: 2rem
  overflow: scroll
  min-width: 40rem

  &.with-background
    background: url(assets/images/pattern-dark.jpeg)

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
