<template>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        <div class="logo"><img src="../assets/logos/codex/gold.svg" /></div>
        <h1>Codex Title Viewer</h1>
        <div class="lead">Decentralized application for viewing Codex Titles</div>
        <b-button variant="primary" @click="metamaskLogin">Login</b-button>
        <b-button variant="outline-primary" @click="aboutCodex">About Codex</b-button>
      </div>
      <div class="col-sm secondary">
        <div class="bust"><img src="../assets/images/bust.png" /></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-view',
  methods: {
    metamaskLogin() {
      const { account } = this.web3
      const personalMessageToSign = 'Please sign this message to authenticate with the Codex Title Registry.'

      this.web3.instance().currentProvider.sendAsync({
        method: 'personal_sign',
        params: [
          account,
          this.web3.instance().toHex(personalMessageToSign),
        ],
      }, (error, result) => {
        if (error) {
          console.log(error)
        } else {
          // This will be populated if the user rejects the signature prompt
          if (result.error) {
            console.log(result.error)
            return
          }

          this.$store.dispatch('sendAuthRequest', {
            userAddress: account,
            signedData: result.result.substr(2),
          }).then(() => {
            this.$router.replace('collection')
          })
        }
      })
    },
    aboutCodex() {
      window.location = 'https://www.codexprotocol.com'
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
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
