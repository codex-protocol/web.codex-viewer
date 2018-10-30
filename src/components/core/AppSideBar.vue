<template>
  <nav>
    <div class="logo" v-party-mode-activator>
      <img src="../../assets/logos/codex/gold.svg">
    </div>
    <div class="button-container">
      <b-link
        v-for="(navItem, index) in navItems"
        :key="index"
        :to="navItem.to"
        @click.prevent="navItem.action ? navItem.action() : hideNav()"
        v-if="navItem.condition"
      >
        <img :src="navItem.icon">{{ navItem.text }}
        <b-badge
          variant="danger"
          v-if="navItem.text === 'Transfers' && numberOfIncomingTransfers > 0"
        >
          {{ numberOfIncomingTransfers }}
        </b-badge>
      </b-link>
      <hr />
      <div class="contact" v-if="user">
        Logged in as <DisplayName :userObject="user" />
      </div>
      <PrepaidTransactionsControl />
    </div>
  </nav>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import DisplayName from '../util/DisplayName'
import PrepaidTransactionsControl from '../PrepaidTransactionsControl'

import Transfer from '../../util/api/transfer'
import EventBus from '../../util/eventBus'
import config from '../../util/config'

import iconHome from '../../assets/icons/home.svg'
import iconCollection from '../../assets/icons/collection.svg'
import iconTransfers from '../../assets/icons/transfers.svg'
import codxIcon from '../../assets/icons/codx-token.svg'
import faucetIcon from '../../assets/icons/faucet.svg'
import starIcon from '../../assets/icons/star.svg'
import galleryIcon from '../../assets/icons/gallery.svg'
import settingsIcon from '../../assets/icons/settings.svg'
import logoutIcon from '../../assets/icons/logout.svg'

export default {
  name: 'AppSideBar',

  props: ['hideNav'],

  components: {
    DisplayName,
    PrepaidTransactionsControl,
  },

  data() {
    return {
      navItems: [],
      numberOfIncomingTransfers: 0,
      showFaucet: config.showFaucet,
      showCodexGallery: config.showCodexGalleryInSideBar,
    }
  },

  created() {
    if (this.isAuthenticated) {
      this.updateIncomingTransfersCount()
    }
  },

  mounted() {
    this.navItems = [
      {
        to: '/login',
        condition: !this.isAuthenticated,
        icon: iconHome,
        text: 'Home',
      },
      {
        to: '/collection',
        condition: this.isAuthenticated,
        icon: iconCollection,
        text: 'Collection',
      },
      {
        to: '/transfers',
        condition: this.isAuthenticated,
        icon: iconTransfers,
        text: 'Transfers',
      },
      {
        to: '/manage-tokens',
        condition: this.showManageTokensPage,
        icon: codxIcon,
        text: 'ManageTokens',
      },
      {
        to: '/faucet',
        condition: this.showFaucet,
        icon: faucetIcon,
        text: 'Faucet',
      },
      {
        to: '/extensions',
        condition: this.isAuthenticated,
        icon: starIcon,
        text: 'Extensions',
      },
      {
        to: '/galleries',
        condition: this.showCodexGallery,
        icon: galleryIcon,
        text: 'Galleries',
      },
      {
        to: '/settings',
        condition: this.isAuthenticated,
        icon: settingsIcon,
        text: 'Settings',
      },
      {
        to: '/logout',
        action: this.logout,
        condition: this.isAuthenticated,
        icon: logoutIcon,
        text: 'Logout',
      },
      {
        to: '/login',
        condition: !this.isAuthenticated,
        icon: logoutIcon,
        text: 'Login',
      },
    ]

    EventBus.$on('socket:codex-record:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.updateIncomingTransfersCount)
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-record:address-approved:approved', this.updateIncomingTransfersCount)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.updateIncomingTransfersCount)
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isAuthenticated']),

    showManageTokensPage() {
      return this.user && this.user.type === 'savvy' && config.showManageTokensPage
    },
  },

  methods: {
    logout() {
      this.hideNav()
      EventBus.$emit('events:click-logout-button', this)
      this.$store.dispatch('auth/LOGOUT_USER')
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
@import "../../assets/variables.styl"

hr
  border-top: 1px solid rgba($color-light, .5)
  margin: 1rem 1rem 0

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
    margin-bottom: 0.5rem

    @media screen and (min-width: $breakpoint-md)
      text-align: left
      width: auto
      margin-bottom: 0

.badge
  margin-left: .25em
  border-radius: .25em

.contact
  text-align: center
  padding: 1rem
  word-break: break-word

</style>
