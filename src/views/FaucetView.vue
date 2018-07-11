<template>
  <div>
    <app-header title="CODX Faucet" />

    <p>
      Welcome to the CodexCoin (CODX) Faucet.
      In the blockchain space, a faucet is an application that issues tokens to requesting users for free.
    </p>
    <p>
      Click the button below to request the Codex Protocol ERC-20 token, CodexCoin.
      After requesting a drip from the faucet, CodexCoin will be sent to the MetaMask account you are currently logged in to.
    </p>
    <p>
      Make sure to get some CodexCoin from the faucet!
      Right now fees are turned off on the protocol,
      but later this week we'll enable fees and you'll be required to have CodexCoin to transact with the protocol.
    </p>
    <p v-if="!userState.user">
      You need to be logged in before you can request tokens from the faucet!
      Login using the button on the side.
    </p>

    <b-button
      class="mb-3"
      variant="primary"
      v-b-modal.faucetModal
      :disabled="!userState.user"
    >
      Get more CODX
    </b-button>

    <p>Your balance: {{ formattedBalance }} CODX</p>

    <faucet-modal />
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import formatTokenAmount from '../util/formatTokenAmount'

import AppHeader from '../components/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'

export default {
  name: 'faucet-view',
  components: {
    AppHeader,
    FaucetModal,
  },
  created() {
    EventBus.$emit('events:faucet-page')
  },
  computed: {
    userState() {
      return this.$store.state.auth
    },
    formattedBalance() {
      return formatTokenAmount(this.userState.balance)
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>
