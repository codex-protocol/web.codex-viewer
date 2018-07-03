<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-5">
        <div class="logo"><b-link href="/#/"><img src="../assets/logos/codex/gold.svg" /></b-link></div>
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
        <login-marketing-card v-if="showLoginMarketingCard" />
      </div>
      <div class="col-sm-7 secondary">
        <div class="login-art"><img src="../assets/images/login-art.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../util/config'
import EventBus from '../util/eventBus'
import { Web3Errors } from '../store/modules/web3'
import { ExpectedNetworkId, Networks } from '../util/constants/web3'

import LoginMarketingCard from '../components/LoginMarketingCard'

export default {
  name: 'login-view',
  components: {
    LoginMarketingCard,
  },
  data() {
    return {
      buttonTitle: 'Login',
      buttonMethod: this.metamaskLogin,
      showLoginMarketingCard: config.showCodexQuestsMarketing,
    }
  },
  methods: {
    installMetamask() {
      window.open('https://www.metamask.io', '_blank')
      this.setButton('MetaMask has been installed', this.checkMetamask)
      EventBus.$emit('events:click-install-metamask')
    },
    checkMetamask() {
      EventBus.$emit('events:click-check-metamask')
      window.location.reload(true)
    },
    metamaskLogin() {

      const { account } = this.web3
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Registry.'

      EventBus.$emit('events:click-login-button')

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
          console.error(error || result.error)
          return
        }

        EventBus.$emit('events:login')

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
          this.setButton('Login', this.metamaskLogin)
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
    EventBus.$emit('events:viewer:view-login-page')
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

  .container
    height: 100%
    display: flex
    align-items: center

  .row
    width: 100%

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

  .btn-primary
    min-width: calc(50% - 0.5rem)

  .login-art img
    width: 100%

</style>
