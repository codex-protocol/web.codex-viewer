<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-7">
        <div class="logo"><b-link href="/#/"><img src="../assets/logos/codex/gold.svg" /></b-link></div>
        <h1 v-html="pageContent.title"></h1>
        <div class="lead" v-html="pageContent.description"></div>
        <b-button
          v-if="buttonTitle"
          variant="primary"
          @click="buttonMethod"
        >
          {{ buttonTitle }}
        </b-button>
      </div>
      <div class="col-sm-5 secondary">
        <div class="bust"><img src="../assets/images/bust.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import { Web3Errors } from '../store/modules/web3'
import { ExpectedNetworkId, Networks } from '../util/constants/web3'

export default {
  name: 'login-view',
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
            this.$router.replace('collection')
          })

      })
    },
    setButton(title, method) {
      this.buttonTitle = title
      this.buttonMethod = method
    },
  },
  data() {
    return {
      buttonTitle: 'Login',
      buttonMethod: this.metamaskLogin,
    }
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
          title = 'Wrong MetaMask network'
          description = `You're on the wrong MetaMask network. Expected network is ${Networks[ExpectedNetworkId]}. Please change the network in your MetaMask settings.`
          this.setButton(false)
          break

        case Web3Errors.None:
        default:
          title = 'Login'
          description = 'Login with your MetaMask account to create, view, &amp; transfer Codex Records'
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

  .container
    display: flex
    align-items: center
    height: 100%

  .row
    width: 100%

  .secondary
    text-align: right

  .logo
    max-width: 100px
    margin-bottom: 2.5rem

  h1
    font-family: $font-family-serif
    font-weight: bold
    font-size: 3rem

  .lead
    font-weight: 400
    font-size: 1.25rem
    margin-bottom: 3.125rem

  .btn-primary
    margin-right: 1rem

</style>
