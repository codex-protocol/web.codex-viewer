<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo">
          <b-link href="/" replace>
            <img src="../assets/logos/codex/gold.svg" />
          </b-link>
        </div>

        <h1>{{ title }}</h1>
        <div class="lead">{{ description }}</div>

        <b-alert
          show
          class="mt-5"
          variant="secondary"
          v-if="pendingUserStats && pendingUserStats.email"
        >
          You have {{ pendingUserStats.numApproved }}
          Codex {{ pendingUserStats.numApproved === 1 ? 'Record' : 'Records' }}
          waiting to be claimed. Log in with an Identity Provider below
          associated with the email <strong>{{ pendingUserStats.email }}</strong> to
          claim them!

          <!-- add a "claim with a different email" link here if/when that flow is implemented -->
        </b-alert>

        <p class="mt-5 mb-3">
          <b>Sign in below to get started</b>
        </p>

        <div class="icons mb-3">
          <a :href="googleLoginUrl" v-if="supportEmailAccounts">
            <IconBase iconName="google" width="48" height="48" />
          </a>
          <a :href="facebookLoginUrl" :disabled="disableFacebook" v-if="supportEmailAccounts">
            <IconBase iconName="facebook" width="48" height="48" />
          </a>
          <a :href="microsoftLoginUrl" :disabled="disableMicrosoft" v-if="supportEmailAccounts">
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

      googleLoginUrl: `${config.apiUrl}/oauth2/login/google`,
      facebookLoginUrl: `${config.apiUrl}/oauth2/login/facebook`,
      microsoftLoginUrl: `${config.apiUrl}/oauth2/login/microsoft`,

      // Facebook and Microsoft support HTTPS for redirect_uri so we disable these in ropsten
      disableFacebook: config.expectedNetworkName === 'ropsten',
      disableMicrosoft: config.expectedNetworkName === 'ropsten',

      pendingUserStats: null,
    }
  },

  created() {
    // remove pendingUserCode from the query params if specified
    if (this.$route.query.pendingUserCode) {
      this.$store.commit('app/SET_PENDING_USER_CODE', this.$route.query.pendingUserCode)
      this.$router.replace({ name: this.$route.name })
    } else if (this.pendingUserCode) {
      const oAuth2LoginQueryString = `?pendingUserCode=${this.pendingUserCode}`
      this.googleLoginUrl += oAuth2LoginQueryString
      this.facebookLoginUrl += oAuth2LoginQueryString
      this.microsoftLoginUrl += oAuth2LoginQueryString
      this.getPendingUserStats(this.pendingUserCode)
    }
  },

  computed: {
    ...mapState('app', ['apiError', 'pendingUserCode']),
    ...mapState('auth', ['user']),
    ...mapState('web3', ['providerAccount', 'instance', 'registrationError']),

    title() {
      if (this.apiError) {
        return 'Error'
      }

      return 'Sign in'
    },

    description() {
      if (this.apiError) {
        return 'We were unable to log you in with your account. Try again later.'
      }

      return 'Codex Viewer allows you to create, view, and transfer Codex Records'
    },

    errorMessage() {
      if (!this.registrationError) {
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
  },

  methods: {
    registerWalletProvider(provider) {
      this.walletProvider = provider

      this.$store.dispatch('auth/LOGIN_FROM_SIGNED_DATA')
        .then(() => {
          // We know this authentication happened from the Login view, so we can send the user directly to the collection page
          // We don't have to worry about the isLoading flag here since it is already set to true
          this.$router.replace({ name: this.$route.meta.ifAuthenticatedRedirectTo || 'collection' })
        })
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
