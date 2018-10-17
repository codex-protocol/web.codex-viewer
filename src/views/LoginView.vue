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

        <div class="login-buttons">
          <a :href="oauthLoginUrl" class="mb-3">
            <img src="../assets/images/google-signin@2x.png">
          </a>
          <b-button
            v-if="buttonTitle"
            variant="outline-primary"
            @click="buttonMethod"
            :disabled="buttonDisabled"
          >
            {{ buttonTitle }}
          </b-button>
        </div>
        <p class="mt-3">{{ errorMessage }}</p>
      </div>
      <div class="col-12 col-md-6 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import is from 'is_js'
import debug from 'debug'
import { mapState } from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import { Web3Errors, Networks } from '../util/constants/web3'

const logger = debug('app:component:login-view')

export default {
  name: 'LoginView',

  data() {
    return {
      isMobile: is.mobile(),
      oauthLoginUrl: `${config.apiUrl}/oauth2/login/google`,
    }
  },

  created() {
    EventBus.$emit('events:view-login-page', this)
  },

  computed: {
    ...mapState('auth', ['apiError']),
    ...mapState('web3', ['account', 'instance', 'error']),

    title() {
      if (this.apiError) {
        return 'Error'
      }

      return 'Login'
    },

    description() {
      if (this.apiError) {
        return 'We were unable to log you in with your Google account. Try again later.'
      }

      return 'Login to create, view, and transfer Codex Records'
    },

    buttonTitle() {
      switch (this.error) {
        case Web3Errors.Unknown:
        case Web3Errors.Missing:
          return this.isMobile
            ? 'Install Coinbase Wallet'
            : 'Install MetaMask'

        default:
          return 'Login with Web3'
      }
    },

    buttonMethod() {
      switch (this.error) {
        case Web3Errors.Unknown:
        case Web3Errors.Missing:
          return this.installWeb3

        default:
          return this.web3Login
      }
    },

    buttonDisabled() {
      switch (this.error) {
        case Web3Errors.Locked:
        case Web3Errors.WrongNetwork:
          return true

        default:
          return false
      }
    },

    errorMessage() {
      switch (this.error) {
        case Web3Errors.Locked:
          return 'Your Web3 account is locked. To login with Web3, open your Ethereum wallet and follow the instructions to unlock it.'

        case Web3Errors.Unknown:
        case Web3Errors.Missing:
          return 'To continue, sign in with Google or install a Web3 wallet to login with Web3.'

        case Web3Errors.WrongNetwork:
          return `You're on the wrong Ethereum network. The expected network is ${Networks[config.expectedNetworkId]}. Sign in with Google or change the network in your wallet settings.`

        default:
          return null
      }
    },

    showCoinbaseWalletLink() {
      return this.isMobile && this.error === Web3Errors.Missing
    },
  },

  methods: {
    installWeb3() {
      window.open(
        this.isMobile ? 'https://wallet.coinbase.com' : 'https://www.metamask.io',
        '_blank'
      )

      EventBus.$emit('events:click-install-metamask', this)
    },

    web3Login() {
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'

      EventBus.$emit('events:click-login-button', this)

      const sendAsyncOptions = {
        method: 'personal_sign',
        params: [
          this.account,
          this.instance.utils.toHex(personalMessageToSign),
        ],
      }

      this.instance.currentProvider.sendAsync(sendAsyncOptions, (error, result) => {

        // result.error will be populated if the user rejects the signature
        //  prompt
        if (error || result.error) {
          logger(error || result.error)
          return
        }

        EventBus.$emit('events:login', this)

        this.$store.dispatch('auth/SEND_AUTH_REQUEST', {
          userAddress: this.account,
          signedData: result.result.substr(2),
        })
          .then(() => {
            this.$router.replace({ name: 'collection' })
          })
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .login-buttons
    display: flex
    flex-wrap: wrap

    a
      background-color: white
      text-align: center

    a > img, button
      height: 3rem

    @media(min-width: 600px)
      a
        margin-right: 1rem

    @media screen and (max-width: $breakpoint-md)
      a, button
        width: 100%

  .logo
    max-width: 100px
    margin-bottom: 2.5rem
    margin-top: 2.5rem

  h1
    font-weight: bold
    font-family: $font-family-serif

  .lead
    margin-bottom: 3rem

  .login-art img
    width: 100%
    margin-top: 3rem

</style>
