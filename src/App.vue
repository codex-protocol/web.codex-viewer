<template>
  <div id="app">
    <app-side-bar v-if="authToken" />
    <div class="main-content" :class="{ 'with-background': this.$route.name === 'login' }">
      <router-view />
    </div>
    <meta-mask-modal />
  </div>
</template>

<script>
import axios from 'axios'

import config from './util/config'
import AppSideBar from './components/AppSideBar'
import MetaMaskModal from './components/modals/MetaMaskModal'

export default {
  name: 'App',
  components: {
    AppSideBar,
    MetaMaskModal,
  },
  created() {
    this.$store.dispatch('registerWeb3', this.$router)
      .then(() => {
        if (this.authToken) {
          this.$store.dispatch('updateUserState')
        }
      })

    this.initializeApi()
  },
  computed: {
    authToken() {
      return this.$store.state.auth.token
    },
    titleId() {
      return this.$route.params.titleId
    },
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    initializeApi() {
      axios.defaults.baseURL = config.apiUrl
      axios.defaults.headers.common['Content-Type'] = 'application/json'

      // TODO: Need to test this by expiring the auth token on the server
      const authErrorHandler = (response) => {
        if ((response.error && response.error.status === 401) ||
        response.status === 401) {
          this.$store.commit('clearUserState')
        }

        return response
      }

      // TODO: If this route is authenticated we'll want to send the user
      //  to the /login endpoint
      axios.interceptors.response.use(
        authErrorHandler,
        authErrorHandler
      )
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
