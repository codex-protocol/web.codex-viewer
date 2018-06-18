<template>
  <nav>
    <div class="logo">
      <img src="../assets/logos/codex/gold.svg">
    </div>
    <div class="button-container" v-if="isAuthenticated">
      <b-link to="/collection">
        <img src="../assets/icons/collection.svg">Collection
      </b-link>
      <b-link to="/transfers">
        <img src="../assets/icons/transfers.svg">Transfers
        <b-badge variant="danger" v-if="numberOfIncomingTransfers > 0">{{numberOfIncomingTransfers}}</b-badge>
      </b-link>
      <b-link to="/settings">
        <img src="../assets/icons/settings.svg">Settings
      </b-link>
      <b-link v-if="showManageTokensPage" to="/manage-tokens">
        <img src="../assets/icons/codx-token.svg">Manage Tokens
      </b-link>
      <b-link to="/coming-soon">
        <img src="../assets/icons/star.svg">Coming Soon
      </b-link>
      <span class="spacer"></span>
      <b-link @click.prevent="logout">
        <img src="../assets/icons/logout.svg">Logout
      </b-link>
    </div>
    <div class="button-container" v-else>
      <b-link to="/login">
        <img src="../assets/icons/logout.svg">Login
      </b-link>
    </div>
  </nav>
</template>

<script>

import axios from 'axios'

import EventBus from '../util/eventBus'
import { showManageTokensPage } from '../util/config'

export default {
  name: 'app-side-bar',
  data() {
    return {
      numberOfIncomingTransfers: 0,
      showManageTokensPage,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
  },
  created() {
    if (this.isAuthenticated()) {
      this.updateIncomingTransfersCount()
    }
  },
  mounted() {
    EventBus.$on('socket:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$on('socket:record-transferred:new-owner', this.updateIncomingTransfersCount)
  },
  beforeDestroy() {
    EventBus.$off('socket:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$off('socket:record-transferred:new-owner', this.updateIncomingTransfersCount)
  },
  methods: {
    logout() {
      EventBus.$emit('events:click-logout-button')
      this.$store.dispatch('logout', this.$router)
    },
    // @TODO: instead of requesting these independantly of
    //  src/views/TransferListView.vue, the list of transfers should really be
    //  retrieved & cached in vuex (or Resource pattern)
    //
    // @NOTE: this is also not responsive when a user ignores a transfer (until
    //  they refresh the page of course), and the TODO above would address that
    updateIncomingTransfersCount() {
      const requestOptions = {

        method: 'get',
        url: '/user/transfers/incoming',

        params: {
          filters: {
            isIgnored: false,
          },
        },
      }

      return axios(requestOptions)
        .then((response) => {
          this.numberOfIncomingTransfers = response.data.result.length
        })
        .catch((error) => {
          // no need to show a toast here? this isn't a critical request
          // EventBus.$emit('toast:error', `Could not fetch ${transferDirection} transfers: ${error.message}`)
          console.error('could not fetch incoming transfers for AppSideBar:', error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

nav
  width: 14rem
  height: 100%
  min-width: @width
  max-width: @width
  overflow-y: scroll
  background-color: rgba(white, .05)

  display: flex
  flex-direction: column

.spacer
  flex-grow: 1

a
  padding: 1rem
  display: block
  line-height: 1rem
  color: $color-light
  box-sizing: border-box

  img
    margin-right: .5rem

  &:hover
    text-decoration: none
    background-color: rgba(white, .1)

  &.active
    font-weight: bold
    background-color: rgba(white, .25)

.logo
  height: 4rem
  padding: 1em 0
  text-align: center
  box-sizing: content-box

  img
    height: 100%

.button-container
  flex-grow: 1
  display: flex
  flex-direction: column

.badge
  margin-left: .25em
  border-radius: .25em

</style>
