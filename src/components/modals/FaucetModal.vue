<template>
  <b-modal
    id="faucetModal"
    title="Get CODX tokens"
    ok-title="Request tokens"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="requestTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <p>
      To perform certain actions like creating new Records, a small fee in the form of CODX tokens is necessary. You may request free tokens to help facilitate testing by clicking the button below!
    </p>
  </b-modal>
</template>

<script>

import Faucet from '../../util/api/faucet'
import EventBus from '../../util/eventBus'

export default {
  name: 'faucetModal',
  data() {
    return {
      dripAmount: 100,
      modalVisible: false,
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3.instance()
    },
    balance() {
      return this.$store.state.auth.balance
    },
  },
  methods: {
    requestTokens(event) {
      event.preventDefault()
      EventBus.$emit('events:faucet-request')

      Faucet.getDripFromFaucet()
        .then(() => {
          EventBus.$emit('toast:success', 'Tokens requested successfully! Your balance will update soon.', 5000)
          this.modalVisible = false

          // This will update the UI optimistically even though the token transfer may still be pending
          this.$store.dispatch('handleFaucetRequest', this.balance.add(this.web3.toWei(this.dripAmount, 'ether')))
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not request tokens: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
