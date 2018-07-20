<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="CODX Faucet" />

        <div class="content">
          <p>
            Welcome to the CodexCoin (CODX) Faucet.
            In the blockchain space, a faucet is an application that issues tokens to requesting users for free.
          </p>
          <p>
            Click the button below to request the Codex Protocol ERC-20 token, CodexCoin.
            After requesting a drip from the faucet, CodexCoin will be sent to the MetaMask account you are currently logged in to.
            You can request 1 drip every 24 hours.
          </p>
          <p>
            Make sure to get some CodexCoin from the faucet!
            When fees are enabled, you'll be required to have CodexCoin to transact with the protocol.
          </p>
          <p v-if="!userState.user">
            You need to be logged in before you can request tokens from the faucet!
            Login using the button on the side.
          </p>
          <div v-else>

            <hr>

            <div>
              <b-button
                class="mb-3"
                variant="primary"
                v-b-modal.faucetModal
                :disabled="!this.userState.user.canRequestFaucetTokens"
              >
                Get more CODX
              </b-button>

              <p>Your balance: {{ formattedBalance }} CODX</p>
              <p v-if="!userState.user.canRequestFaucetTokens">
                <strong>You'll be able to request more CODX in {{ nextRequestIn }}</strong>
              </p>

              <faucet-modal />
            </div>

            <hr>

            <div>
              <p>Registry contract approved? {{ registryContractApproved ? 'Yes!' : 'No' }}</p>
              <b-button variant="primary" v-b-modal.approveRegistryModal :disabled="registryContractApproved">
                Approve the registry contract
              </b-button>

              <approve-contract-modal id="approveRegistryModal" :contractInstance="recordContract" stateProperty="registryContractApproved">
                This will grant the Codex Viewer permission to spend CODX on your behalf.
              </approve-contract-modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import { timeSince } from '../util/dateHelpers'
import formatTokenAmount from '../util/formatTokenAmount'

import AppHeader from '../components/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {
  name: 'faucet-view',
  components: {
    AppHeader,
    FaucetModal,
    ApproveContractModal,
  },
  created() {
    EventBus.$emit('events:faucet-page')
  },
  computed: {
    userState() {
      return this.$store.state.auth
    },
    registryContractApproved() {
      return this.userState.registryContractApproved
    },
    formattedBalance() {
      return formatTokenAmount(this.userState.balance)
    },
    nextRequestIn() {
      const lastRequestedAt = new Date(this.userState.user.faucetLastRequestedAt)
      const nextDay = new Date(lastRequestedAt.getTime() - (86400 * 1000))
      return timeSince(nextDay)
    },
    recordContract() {
      return this.$store.state.web3.recordContractInstance()
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.content

  @media screen and (min-width: $breakpoint-lg)
    max-width: 50%

hr
  width: 100%
  margin-top: 2rem
  margin-bottom: 2rem
  border-color: rgba($color-primary, .25)
</style>
