<template>
  <div>
    <div
      id="app"
      @mousedown="topLevelClick($event)"
      :class="{
        'show-nav': showNav,
        'with-background': useBackgroundImage(),
      }"
    >
      <AppWarningBanner v-if="showWarningBanner" />
      <div class="app-wrapper">
        <template v-if="!hideSideBar">
          <span class="hamburger" @click="TOGGLE_NAV">
            <IconBase
              width="28"
              height="32"
              iconName="menu"
              class="icon-menu"
            />
          </span>
          <AppSideBar />
        </template>
        <div class="main-content-wrapper" ref="main-content-wrapper">
          <div class="main-content">
            <router-view :key="$route.fullPath" v-if="isLoaded" />
            <LoadingOverlay type="global" v-else />
          </div>
          <AppFooter />
        </div>
        <ToastContainer />
        <VueCookieAcceptDecline position="bottom" type="bar" elementId="1" disableDecline>
          <div slot="message">
            This website stores cookies on your computer. Cookies are used to save information about how you interact with our website and allow us to remember you when you return. We never sell this information, and we use it strictly for analytics and metrics. For more information, please see our <a href="https://codexprotocol.com/privacy-policy" target="_blank">Privacy Policy.</a>
          </div>
        </VueCookieAcceptDecline>
      </div>
    </div>
    <ReferralSurveyModal v-if="isAuthenticated && !user.hasAnsweredReferralSurvey" />
  </div>
</template>

<script>

import axios from 'axios'
import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex'
import VueCookieAcceptDecline from 'vue-cookie-accept-decline'

import './util/analytics'

import config from './util/config'
import EventBus from './util/eventBus'

import AppFooter from './components/core/AppFooter'
import AppSideBar from './components/core/AppSideBar'
import AppWarningBanner from './components/core/AppWarningBanner'

import IconBase from './components/icons/IconBase'
import LoadingOverlay from './components/util/LoadingOverlay'
import ToastContainer from './components/util/ToastContainer'
import PartyModeActivator from './directives/PartyModeActivator'
import ReferralSurveyModal from './components/modals/ReferralSurveyModal'

export default {

  components: {
    ReferralSurveyModal,
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
      showWarningBanner: config.expectedNetworkId !== '1' && config.expectedNetworkId !== '5777',
    }
  },

  created() {
    this.initializeApi()

    EventBus.$on('socket:codex-coin:registry-contract-approved', this.fetchApprovalStatuses)
    EventBus.$on('socket:meta:codex-coin:sync-available-balance', this.syncAvailableCODXBalance)

    EventBus.$on('socket:codex-record:created', this.addUserRecord)
    EventBus.$on('socket:codex-record:modified', this.updateUserRecord)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.addUserRecord)
    EventBus.$on('socket:codex-record:transferred:old-owner', this.removeUserRecord)

    EventBus.$on('socket:codex-record:address-approved:owner', this.addOutgoingTransfer)
    EventBus.$on('socket:codex-record:address-approved:approved', this.addIncomingTransfer)
  },

  mounted() {
    this.$store.commit('app/ADD_GLOBAL_REF', {
      $ref: this.$refs['main-content-wrapper'],
      name: 'main-content-wrapper',
    })
    this.$store.dispatch('app/FETCH_BOOTSTRAP_DATA')
      .finally(() => {
        this.initializeApp()
      })
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-coin:registry-contract-approved', this.fetchApprovalStatuses)
    EventBus.$off('socket:meta:codex-coin:sync-available-balance', this.syncAvailableCODXBalance)

    EventBus.$off('socket:codex-record:created', this.addUserRecord)
    EventBus.$off('socket:codex-record:modified', this.updateUserRecord)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.addUserRecord)
    EventBus.$off('socket:codex-record:transferred:old-owner', this.removeUserRecord)

    EventBus.$off('socket:codex-record:address-approved:owner', this.addOutgoingTransfer)
    EventBus.$off('socket:codex-record:address-approved:approved', this.addIncomingTransfer)
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated']),
    ...mapState('auth', ['user', 'authToken']),
    ...mapState('app', ['showNav', 'isLoaded', 'postLoginDestination', 'giveaway']),

    hideSideBar() {
      return this.$route.meta && this.$route.meta.hideSideBar
    },
  },

  methods: {
    ...mapActions('app', ['TOGGLE_NAV']),

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

    fetchApprovalStatuses() {
      this.$store.dispatch('auth/FETCH_APPROVAL_STATUSES')
    },

    syncAvailableCODXBalance(availableCODXBalance) {
      this.$store.commit('auth/SYNC_AVAILABLE_CODX_BALANCE', availableCODXBalance)
    },

    useBackgroundImage() {
      return this.$route.meta.useBackgroundImage || false
    },

    // here we capture all events that bubble up to the top level "app"
    //  component as a way to close popovers that have clickable content inside
    //  of them
    //
    // the idea is to check if the clicked element (event.target) is a child of
    //  an element with the .popover class... if so, do nothing to keep the
    //  popover open, otherwise close all popovers
    //
    // ideally you'd do this with some sort of directive that dynamically adds
    //  and removes a click handler on the body element when the popover opens,
    //  but this method was a lot easier
    //
    // @NOTE: this has one caveat - you need to add @click.stop to popover
    //  triggering elements, otherwise the popover closes as soon as it opens
    //
    // @NOTE: on 2018-02-26 this was extended to also check for the
    //  "suppress-top-level-click" attribute which can be used for the same
    //  purpose but not limited to popovers (also note that we can't just add
    //  this attribute to the popover because vue-bootstrap dynamically
    //  generates that element...)
    topLevelClick(event) {
      if (
        event &&
        event.target &&
        event.target.closest &&
        (event.target.closest('.popover') !== null || event.target.closest('[suppress-top-level-click]') !== null)
      ) {
        return
      }
      EventBus.$emit('app:top-level-click')
      this.$root.$emit('bv::hide::popover')
    },
  },
}
</script>

<style lang="stylus">

@import "./assets/variables.styl"
@import "./assets/z-indexes.styl"
@import "./assets/global.styl"

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

  // "visually disable" the application when the freshchat widget is open
  &.fc-widget-open
    #app
      opacity: .5
      filter: blur(2px)
      user-select: none
      pointer-events: none
      transition: opacity ease 1s, filter ease 1s

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
      width: 100%
      height: 100%
      display: flex
      position: absolute
      background-color: rgba(darken($color-dark, 25%), .95)

    .main-content-wrapper
      filter: blur(4px)

.app-wrapper
  width: 100%
  flex-grow: 1
  display: flex
  overflow: hidden
  position: relative

.hamburger
  top: 10px
  right: 20px
  padding: 10px
  cursor: pointer
  position: absolute
  color: $color-primary

  @media (min-width: $breakpoint-md)
    display: none

.main-content-wrapper
  width: 100%
  flex-grow: 1
  max-height: 100%
  overflow-y: auto
  overflow-x: hidden
  -webkit-overflow-scrolling: touch

  @media (min-width: $breakpoint-md)
    display: flex
    flex-direction: column

.main-content
  width: 100%
  flex-grow: 1

  // uncommenting these will cause the footer to stay positioned at the bottom
  //  of the main content area instead of being pushed down by a tall
  // .main-content div
  //
  //   overflow-y: auto
  //   overflow-x: hidden

.cookie
  color: $color-dark
  padding: 2rem !important
  background-color: $color-light !important

  a
    font-weight: 700
    color: $color-secondary

  button
    background: lighten($color-secondary, 25%) !important

</style>
