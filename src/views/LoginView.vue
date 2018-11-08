<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>

        <h1>Sign in</h1>
        <div class="lead">Codex Viewer allows you to create, view, and transfer Codex Records</div>

        <b-alert
          show
          class="mt-5"
          variant="secondary"
          v-if="pendingUserMessage"
        >
          <!--
            @NOTE: using v-html here should be fine, since the only user-defined
            data is the email address... and the database verifies all email
            addresses when creating users

            even if someone could put some malicious text into an invited user's
            email field, nobody would ever actually recieve an email with a link
            that would generate this page since the email would be invalid...
          -->
          <span v-html="pendingUserMessage"></span>
          <!-- add a "claim with a different email" link here if/when that flow is implemented -->
        </b-alert>

        <p class="mt-5 mb-3">
          <b>Sign in below to get started</b>
        </p>

        <div class="icons mb-3">
          <a :href="getOAuth2LoginUrl('google')" v-if="supportEmailAccounts">
            <IconBase iconName="google" width="48" height="48" />
          </a>
          <a :href="getOAuth2LoginUrl('facebook')" :disabled="disableFacebook" v-if="supportEmailAccounts">
            <IconBase iconName="facebook" width="48" height="48" />
          </a>
          <a :href="getOAuth2LoginUrl('microsoft')" :disabled="disableMicrosoft" v-if="supportEmailAccounts">
            <IconBase iconName="microsoft" width="48" height="48" />
          </a>
          <b-link @click="registerWalletProvider('metaMask')">
            <IconBase iconName="metaMask" width="48" height="48" />
          </b-link>
          <b-link @click="registerWalletProvider('coinbaseWallet')">
            <IconBase iconName="coinbaseWallet" width="48" height="48" />
          </b-link>
        </div>

        <b-alert
          class="mt-5"
          variant="danger"
          :show="!!errorMessage"
          v-html="errorMessage"
        />
      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" v-party-mode-activator /></div>
      </div>
    </div>
  </div>
</template>

<script>
import is from 'is_js'
import debug from 'debug'
import { mapState } from 'vuex'

import config from '../util/config'
import PendingUser from '../util/api/pendingUser'
import { Web3Errors, Networks } from '../util/constants/web3'

import IconBase from '../components/icons/IconBase'

const logger = debug('app:component:login-view')

export default {
  name: 'LoginView',

  components: {
    IconBase,
  },

  data() {
    return {
      isMobile: is.mobile(),
      walletProvider: null,
      supportEmailAccounts: config.supportEmailAccounts,

      // Facebook and Microsoft support HTTPS for redirect_uri so we disable these in ropsten
      disableFacebook: config.expectedNetworkName === 'ropsten',
      disableMicrosoft: config.expectedNetworkName === 'ropsten',

      pendingUserStats: null,
    }
  },

  created() {
    if (this.pendingUserCode) {
      this.getPendingUserStats(this.pendingUserCode)
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['providerAccount', 'instance', 'registrationError']),
    ...mapState('app', ['apiErrorCode', 'pendingUserCode', 'postLoginDestination']),

    oAuth2LoginQueryString() {

      const oAuth2LoginQueryParams = {
        destination: this.postLoginDestination,
        pendingUserCode: this.pendingUserCode,
      }

      return Object
        .keys(oAuth2LoginQueryParams)
        .filter((key) => {
          return !!oAuth2LoginQueryParams[key] // remove any empty values
        })
        .map((key) => {
          return `${key}=${encodeURIComponent(oAuth2LoginQueryParams[key])}`
        })
        .join('&')

    },

    errorMessage() {
      return this.web3ErrorMessage || this.apiErrorMessage
    },

    apiErrorMessage() {
      // Even though we read the error message from the QS, we use a generic one as opposed to rendering
      //  arbitrary text from the query string. Later we'll deprecate the message param and just pivot
      //  based on error codes.
      return this.apiErrorCode
        ? 'We were unable to log you in with your account. Try again later.'
        : null
    },

    web3ErrorMessage() {
      if (!this.registrationError && !this.apiErrorCod) {
        return null
      }

      switch (this.registrationError.message) {
        case Web3Errors.Missing:
          return `You don't have a Web3 wallet installed. To install one, visit <a href="${this.walletProviderUrl}" target="_blank">${this.walletProviderUrl}</a>.`

        case Web3Errors.Locked:
          return 'Your Web3 account is locked. To sign in with Web3, open your Ethereum wallet and follow the instructions to unlock it.'

        case Web3Errors.WrongNetwork:
          return `You're on the wrong Ethereum network. The expected network is ${Networks[config.expectedNetworkId]}. To sign in with Web3, change the network in your wallet settings.`

        case Web3Errors.UserDeniedSignature:
          return 'In order to sign in with your Web3, use your wallet to sign the message that you are prompted with. This will not spend any gas.'

        case Web3Errors.AccountChanged:
          return 'In order to preserve your privacy, we logged you out of Codex Viewer because we detected a change in the Web3 wallet your\'re currently using.'

        default:
          return 'Something went wrong with your Web3 login. Try again later.'
      }
    },

    walletProviderUrl() {
      switch (this.walletProvider) {
        case 'coinbaseWallet':
          return 'https://wallet.coinbase.com'

        default:
        case 'metaMask':
          return 'https://www.metamask.io'
      }
    },

    pendingUserMessage() {

      const { numApproved, numWhitelisted, email } = this.pendingUserStats || {}

      if (!email) {
        return null
      }

      // always show the "you have X records waiting to be claimed" message,
      //  even if they also have some whitelisted records, since this is the
      //  "most important" message to show and combining the two is kind of
      //  complicated
      if (numApproved > 0) {

        const [recordOrRecords, itOrThem] = numApproved > 1
          ? ['Records', 'them']
          : ['Record', 'it']

        return `
          You have ${numApproved} Codex ${recordOrRecords} waiting to be
          claimed. Log in with an Identity Provider associated with the
          email <strong>${email}</strong> below to claim ${itOrThem}!
        `
      }

      if (numWhitelisted > 0) {

        const [recordOrRecords, hasOrHave, itOrThem] = numWhitelisted > 1
          ? ['Records', 'have', 'them']
          : ['Record', 'has', 'it']

        return `
          ${numWhitelisted} Codex ${recordOrRecords} ${hasOrHave} been shared
          with you. Log in with an Identity Provider associated with the
          email <strong>${email}</strong> below to view ${itOrThem}!
        `
      }

      // this is a generic message that will show if this pending user has
      //  nothing available... which can only really happen if someone approves
      //  an unregistered email address, then they approve someone else before
      //  the invited user can click the link in thier email
      //
      // this message is a little missleading, but I suppose it's better than
      //  showing nothing
      return `
        Log in with an Identity Provider associated with the email
        <strong>${email}</strong> below to see what's waiting for you!
      `
    },
  },

  methods: {
    registerWalletProvider(provider) {
      this.walletProvider = provider

      // Clear out error state now that an action has taken place by the user
      if (this.apiErrorCode) {
        this.$store.commit('app/SET_API_ERROR_CODE', null)
      }

      this.$store.dispatch('auth/LOGIN_FROM_SIGNED_DATA')
        .then(() => {
          // We know this authentication happened from the Login view, so we can send the user directly to the collection page
          // We don't have to worry about the isLoading flag here since it is already set to true
          this.$router.replace({ name: 'collection' })
        })
        .catch(() => {
          // do nothing since the LOGIN_FROM_SIGNED_DATA action will catch
          //  errors and dispatch the HANDLE_LOGIN_ERROR action for us
        })
    },

    getOAuth2LoginUrl(provider) {

      if (!['google', 'facebook', 'microsoft'].includes(provider)) {
        return null
      }

      return `${config.apiUrl}/oauth2/login/${provider}?${this.oAuth2LoginQueryString}`
    },

    getPendingUserStats(pendingUserCode) {
      PendingUser.getStats(pendingUserCode)
        .then((pendingUserStats) => {
          this.pendingUserStats = pendingUserStats
        })
        .catch((error) => {
          // do nothing, since this likely means the pending user code was
          //  invalid
          logger(error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .icons a
    margin: 0 1rem

    &:first-child
      margin-left: 0

    &.disabled
      opacity: .5

  .logo
    max-width: 100px
    margin-bottom: 2.5rem
    margin-top: 2.5rem

  h1
    font-weight: bold
    font-family: $font-family-serif

  .login-art img
    width: 100%
    margin-top: 3rem
</style>
