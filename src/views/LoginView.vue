<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-6 primary">
        <div class="logo"><b-link href="/#/"><img src="../assets/logos/codex/gold.svg" /></b-link></div>
        <div v-if="isMobile">
          <h1 v-html="mobilePageContent.title"></h1>
          <div class="lead" v-html="mobilePageContent.description"></div>
          <div v-if="web3Error === Web3Errors.Unknown">
            <a href="http://www.toshi.org/">
              <img src="../assets/images/get-toshi.png" width="200">
            </a>
          </div>
          <div v-else>
            <b-button
              v-if="buttonTitle"
              variant="primary"
              @click="buttonMethod"
              class="mb-5"
            >
              {{ buttonTitle }}
            </b-button>
          </div>
        </div>
        <div v-else>
          <h1 v-html="pageContent.title"></h1>
          <div class="lead" v-html="pageContent.description"></div>
          <b-button
            v-if="buttonTitle"
            variant="primary"
            @click="buttonMethod"
            class="mb-5"
          >
            {{ buttonTitle }}
          </b-button>
        </div>
        <login-marketing-card v-if="showLoginMarketingCard" />
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

import config from '../util/config'
import EventBus from '../util/eventBus'
import { Web3Errors } from '../store/modules/web3'
import { ExpectedNetworkId, Networks } from '../util/constants/web3'

import LoginMarketingCard from '../components/LoginMarketingCard'

const logger = debug('app:component:login-view')

export default {
  name: 'login-view',
  components: {
    LoginMarketingCard,
  },
  data() {
    return {
      buttonTitle: 'Login',
      buttonMethod: this.web3Login,
      showLoginMarketingCard: config.showCodexQuestsMarketing,
      isMobile: is.mobile(),
      Web3Errors,
    }
  },
  methods: {
    installMetamask() {
      window.open('https://www.metamask.io', '_blank')
      this.setButton('MetaMask has been installed', this.checkMetamask)
      EventBus.$emit('events:click-install-metamask', this)
    },
    checkMetamask() {
      EventBus.$emit('events:click-check-metamask', this)
      window.location.reload(true)
    },
    web3Login() {

      const { account } = this.web3
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'

      EventBus.$emit('events:click-login-button', this)

      const sendAsyncOptions = {
        method: 'personal_sign',
        params: [
          account,
          this.web3.instance().toHex(personalMessageToSign),
        ],
      }

      this.web3.instance().currentProvider.sendAsync(sendAsyncOptions, (error, result) => {

        // result.error will be populated if the user rejects the signature
        //  prompt
        if (error || result.error) {
          logger(error || result.error)
          return
        }

        EventBus.$emit('events:login', this)

        const sendAuthRequestOptions = {
          userAddress: account,
          signedData: result.result.substr(2),
        }

        this.$store.dispatch('sendAuthRequest', sendAuthRequestOptions)
          .then(() => {
            this.$router.replace({ name: 'collection' })
          })

      })
    },
    setButton(title, method) {
      this.buttonTitle = title
      this.buttonMethod = method
    },
  },
  computed: {
    mobilePageContent() {
      let title
      let description

      switch (this.web3Error) {
        case Web3Errors.Missing:
          title = 'Let&rsquo;s get started'
          description = '<p>Please use a DApp browser, such as Toshi or Status.</p>'
          this.setButton(false)
          break

        case Web3Errors.Unknown:
          title = 'Let&rsquo;s get started'
          description = '<p>Please use a DApp browser, such as Toshi.</p>'
          this.setButton(false)
          break

        case Web3Errors.WrongNetwork:
          title = 'Wrong Ethereum network'
          description = `You're on the wrong Ethereum network. Expected network is ${Networks[ExpectedNetworkId]}. Please change the network in your DApp browser settings.`
          this.setButton(false)
          break

        case Web3Errors.None:
        default:
          title = 'Login'
          description = 'Login to create, view, &amp; transfer Codex Records'
          this.setButton('Login', this.web3Login)
          break
      }

      return { title, description }
    },
    pageContent() {
      let title
      let description

      switch (this.web3Error) {
        case Web3Errors.Missing:
          title = 'Let&rsquo;s get started'
          description = '<p>To continue, please install the MetaMask browser extension.</p>'
          description += '<p>The best place to store your Codex Records is a secure wallet like MetaMask. This will also be used as your login (no password needed)'
          this.setButton('Install MetaMask', this.installMetamask)
          break

        case Web3Errors.Locked:
          title = 'Your MetaMask is locked'
          description = 'Please open your MetaMask browser extension and follow the instructions to unlock it'
          this.setButton(false)
          break

        case Web3Errors.Unknown:
          title = 'Let&rsquo;s get started'
          description = '<p>To continue, please install the MetaMask browser extension.</p>'
          description += '<p>The best place to store your Codex Records is a secure wallet like MetaMask. This will also be used as your login (no password needed)'
          this.setButton('Install MetaMask', this.installMetamask)
          break

        case Web3Errors.WrongNetwork:
          title = 'Wrong Ethereum network'
          description = `You're on the wrong Ethereum network. Expected network is ${Networks[ExpectedNetworkId]}. Please change the network in your MetaMask settings.`
          this.setButton(false)
          break

        case Web3Errors.None:
        default:
          title = 'Login'
          description = 'Login to create, view, &amp; transfer Codex Records'
          this.setButton('Login', this.web3Login)
          break
      }

      return { title, description }
    },
    web3() {
      return this.$store.state.web3
    },
    web3Error() {
      return this.$store.state.web3.error
    },
  },
  created() {
    EventBus.$emit('events:viewer:view-login-page', this)
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .container
    height: 100%
    display: flex
    align-items: center

  .primary
    margin-bottom: 2rem

    @media screen and (min-width: $breakpoint-md)
      margin-bottom: 0

  .secondary
    text-align: right
    align-self: center

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

    @media screen and (max-width: $breakpoint-md)
      margin-top: 0

</style>
