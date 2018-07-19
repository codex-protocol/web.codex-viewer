<template>
  <nav>
    <div class="logo">
      <img src="../assets/logos/codex/gold.svg">
    </div>
    <div class="button-container" v-if="isAuthenticated">
      <b-link to="/collection" @click.prevent="hideNav">
        <img src="../assets/icons/collection.svg">Collection
      </b-link>
      <b-link to="/transfers" @click.prevent="hideNav">
        <img src="../assets/icons/transfers.svg">Transfers
        <b-badge variant="danger" v-if="numberOfIncomingTransfers > 0">{{numberOfIncomingTransfers}}</b-badge>
      </b-link>
      <b-link to="/codex-quests" @click.prevent="hideNav">
        <img src="../assets/icons/codex-quest.svg">Earn CODX
      </b-link>
      <b-link v-if="showManageTokensPage" to="/manage-tokens" @click.prevent="hideNav">
        <img src="../assets/icons/codx-token.svg">Manage Tokens
      </b-link>
      <b-link v-if="showFaucet" to="/faucet" @click.prevent="hideNav">
        <img src="../assets/icons/faucet.svg">Faucet
      </b-link>
      <b-link to="/extensions" @click.prevent="hideNav">
        <img src="../assets/icons/star.svg">Extensions
      </b-link>
      <b-link to="/galleries" v-if="showCodexGallery" @click.prevent="hideNav">
        <img src="../assets/icons/gallery.svg">Galleries
      </b-link>
      <b-link to="/settings" @click.prevent="hideNav">
        <img src="../assets/icons/settings.svg">Settings
      </b-link>
      <b-link @click.prevent="logout">
        <img src="../assets/icons/logout.svg">Logout
      </b-link>
      <div class="address">
        <div class="network-details" v-if="showNetworkDetails">Logged in as <hash-formatter :data="web3.account" /> ({{ web3.network }})</div>
      </div>
    </div>

    <!--
      @TODO: maybe instead of duplicating content here, we can just move the
      v-if="isAuthenticated" to each button instead of the container?
    -->
    <div class="button-container" v-else>
      <!--
        @NOTE: the home route is actually just "/", but if I use that then
        bootsrap highlights the button as if it were the active route for some
        reason, so we'll just use "/home" which will redirect to "/" anyway
      -->
      <b-link to="/home" @click.prevent="hideNav">
        <img src="../assets/icons/home.svg">Home
      </b-link>
      <b-link to="/codex-quests" @click.prevent="hideNav">
        <img src="../assets/icons/codex-quest.svg">Earn CODX
      </b-link>
      <b-link to="/galleries" v-if="showCodexGallery" @click.prevent="hideNav">
        <img src="../assets/icons/gallery.svg">Galleries
      </b-link>
      <b-link to="/login" @click.prevent="hideNav">
        <img src="../assets/icons/logout.svg">Login
      </b-link>
    </div>
  </nav>
</template>

<script>
import HashFormatter from './HashFormatter'
import Transfer from '../util/api/transfer'
import EventBus from '../util/eventBus'
import config from '../util/config'

export default {
  name: 'app-side-bar',
  props: ['hideNetworkDetails', 'hideNav'],
  components: {
    HashFormatter,
  },
  data() {
    return {
      numberOfIncomingTransfers: 0,
      showFaucet: config.showFaucet,
      showManageTokensPage: config.showManageTokensPage,
      showCodexGallery: config.showCodexGalleryInSideBar,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    },
    web3() {
      return this.$store.state.web3
    },
    showNetworkDetails() {
      return !this.hideNetworkDetails && this.web3.account
    },
  },
  created() {
    if (this.isAuthenticated) {
      this.updateIncomingTransfersCount()
    }
  },
  mounted() {
    EventBus.$on('socket:codex-record:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.updateIncomingTransfersCount)
  },
  beforeDestroy() {
    EventBus.$off('socket:codex-record:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.updateIncomingTransfersCount)
  },
  methods: {
    logout() {
      this.hideNav()
      EventBus.$emit('events:click-logout-button')
      this.$store.dispatch('logout', this.$router)
    },
    // @TODO: instead of requesting these independently of
    //  src/views/TransferListView.vue, the list of transfers should really be
    //  retrieved & cached in vuex (or Resource pattern)
    //
    // @NOTE: this is also not responsive when a user ignores a transfer (until
    //  they refresh the page of course), and the TODO above would address that
    updateIncomingTransfersCount() {
      return Transfer.getIncomingTransfers()
        .then((transfers) => {
          this.numberOfIncomingTransfers = transfers.length
        })
        .catch(() => {
          // @NOTE: This is a non-essential action, so prevent any errors from bubbling further
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

nav
  display: none
  flex-direction: column
  background-color: rgba(white, .05)
  width: 100%

  @media screen and (min-width: $breakpoint-md)
    display: flex
    width: $side-nav-width
    min-height: 100%
    min-width: @width
    max-width: @width
    overflow-y: auto
    padding-top: 0

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
  align-items: center

  @media screen and (min-width: $breakpoint-md)
    align-items: normal

  a
    text-align: center
    width: 100%
    border-bottom: 1px solid $color-primary

    &:first-of-type
      border-top: 1px solid $color-primary

    @media screen and (min-width: $breakpoint-md)
      text-align: left
      width: auto
      border: none

      &:first-of-type
        border: none

.badge
  margin-left: .25em
  border-radius: .25em

.network-details
  padding: 1rem
  word-break: break-word

.address
  text-align: center
  padding: 2rem 0

</style>
