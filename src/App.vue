<template>
  <div>
    <div id="app" :class="{
      'with-background': this.useBackgroundImage(),
      'show-nav': showNav,
    }">
      <AppWarningBanner v-if="showWarningBanner" />
      <div class="app-wrapper">
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
  </div>
</template>

<script>

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
import './filters/format-codx-balance'

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

    EventBus.$on('socket:codex-coin:transferred', (codxCost) => {
      this.$store.commit('auth/REFUND_CODX', { codxCost })
    })

    EventBus.$on('socket:codex-coin:registry-contract-approved', () => {
      this.$store.dispatch('auth/FETCH_APPROVAL_STATUSES')
    })

    EventBus.$on('socket:codex-record:created', this.addUserRecord)
    EventBus.$on('socket:codex-record:modified', this.updateUserRecord)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.addUserRecord)
    EventBus.$on('socket:codex-record:transferred:old-owner', this.removeUserRecord)

    EventBus.$on('socket:codex-record:address-approved:owner', this.addOutgoingTransfer)
    EventBus.$on('socket:codex-record:address-approved:approved', this.addIncomingTransfer)
  },

  mounted() {
    this.initializeApp()
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-coin:transferred')
    EventBus.$off('socket:codex-coin:registry-contract-approved')

    EventBus.$off('socket:codex-record:created', this.addUserRecord)
    EventBus.$off('socket:codex-record:modified', this.updateUserRecord)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.addUserRecord)
    EventBus.$off('socket:codex-record:transferred:old-owner', this.removeUserRecord)

    EventBus.$off('socket:codex-record:address-approved:owner', this.addOutgoingTransfer)
    EventBus.$off('socket:codex-record:address-approved:approved', this.addIncomingTransfer)
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapState('app', ['isLoaded', 'postLoginDestination', 'giveaway']),
    ...mapState('auth', ['user', 'authToken']),

    hideSideBar() {
      return this.$route.meta && this.$route.meta.hideSideBar
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

    initializeApp() {
      this.$store.dispatch('app/HANDLE_QUERY_PARAMS')
        .then(() => {
          if (!this.authToken) {
            return null
          }

          return this.$store.dispatch('auth/LOGIN_FROM_CACHED_TOKEN')
            .then(() => {
              // Start fetching app & user data that is dependent on authentication
              // No need to block on these async actions
              this.$store.dispatch('records/FETCH_USER_DATA')
              this.$store.dispatch('app/FETCH_ELIGIBLE_GIVEAWAY')

              if (!this.$route.meta.ifAuthenticatedRedirect && !this.postLoginDestination) {
                return null
              }

              return new Promise((resolve, reject) => {
                if (this.postLoginDestination) {
                  this.$router.replace({ path: this.postLoginDestination }, resolve, reject)
                } else {
                  this.$router.replace({ name: 'collection' }, resolve, reject)
                }
              })
            })
        })
        .catch(() => {
        // Do nothing, any caught errors will be rendered on the page
        })
        .finally(() => {
          this.$store.commit('app/SET_IS_LOADED', true)
        })
    },

    addUserRecord(codexRecord) {
      // if this was the record created by the giveaway, hide the giveaway card
      if (this.giveaway && codexRecord.metadata.description === this.giveaway.editionDetails.description) {
        this.$store.commit('app/SET_GIVEAWAY', null)
      }

      this.$store.commit('records/ADD_RECORD_TO_LIST', {
        listName: 'userRecords',
        record: codexRecord,
      })
    },

    addIncomingTransfer(codexRecord) {
      this.$store.commit('records/ADD_RECORD_TO_LIST', {
        listName: 'incomingTransfers',
        record: codexRecord,
      })
    },

    addOutgoingTransfer(codexRecord) {
      this.$store.commit('records/ADD_RECORD_TO_LIST', {
        listName: 'outgoingTransfers',
        record: codexRecord,
      })
    },

    updateUserRecord(codexRecord) {
      this.$store.commit('records/UPDATE_RECORD_IN_LISTS', codexRecord)
    },

    removeUserRecord(codexRecord) {
      this.$store.commit('records/REMOVE_RECORD_FROM_LIST', {
        listName: 'userRecords',
        record: codexRecord,
      })

      this.$store.commit('records/REMOVE_RECORD_FROM_LIST', {
        listName: 'outgoingTransfers',
        record: codexRecord,
      })
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
body > div:first-child
  margin: 0
  padding: 0
  width: 100%
  height: 100%

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
  height: 100%
  display: flex
  overflow: hidden
  flex-direction: column
  background-color: $color-dark

  &.with-background
    background-image: url(assets/images/pattern-dark.jpeg)

  // On smaller screens, handle the toggle of showing the side menu
  &.show-nav

    nav
      display: flex

    .main-content-wrapper
      display: none

    // on larger screens always show the side menu and content
    @media screen and (min-width: $breakpoint-md)
      nav
      .main-content-wrapper
        display: flex

.app-wrapper
  width: 100%
  flex-grow: 1
  display: flex
  overflow: hidden

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
  flex-grow: 1
  max-height: 100%
  overflow-x: hidden
  overflow-y: scroll

  @media screen and (min-width: $breakpoint-md)
    display: flex
    flex-direction: column

.main-content
  width: 100%
  flex-grow: 1

  // uncommenting these will cause the footer to stay positioned at the bottom
  //  of the main content area instead of being pushed down by a tall
  //  .main-content div
  //
  // overflow-x: hidden
  // overflow-y: scroll

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
    background-color: $color-gray
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
      background-color: $color-success

  // lighten all the border & background colors when disabled
  &:disabled
    border-color: lighten($color-gray, 25%)

    &::before
      color: lighten($color-light, 25%)
      background-color: lighten($color-gray, 25%)

    &:checked
      border-color: lighten($color-success, 25%)

      &::before
        background-color: lighten($color-success, 25%)

// End CSS Checkbox toggle
</style>
