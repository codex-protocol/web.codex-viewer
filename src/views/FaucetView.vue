<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="CODX Faucet" />

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
          <p v-if="!user">
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
                :disabled="!user.canRequestFaucetDrip"
              >
                Get more CODX
              </b-button>

              <p>Your balance: {{ formattedBalance }} CODX</p>
              <p v-if="!user.canRequestFaucetDrip">
                <strong>You'll be able to request more CODX in {{ nextRequestIn }}</strong>
              </p>

              <FaucetModal />
            </div>

            <hr>

            <div>
              <p>Registry contract approved? {{ registryContractApproved ? 'Yes!' : 'No' }}</p>
              <b-button variant="primary" v-b-modal.approveRegistryModal :disabled="registryContractApproved">
                Approve the registry contract
              </b-button>

              <ApproveContractModal id="approveRegistryModal" :contract="recordContract" stateProperty="registryContractApproved">
                This will grant the Codex Viewer permission to spend CODX on your behalf.
              </ApproveContractModal>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { timeSince } from '../util/dateHelpers'
import formatTokenAmount from '../util/formatTokenAmount'

import AppHeader from '../components/core/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'
import ApproveContractModal from '../components/modals/ApproveContractModal'

export default {
  name: 'FaucetView',

  components: {
    AppHeader,
    FaucetModal,
    ApproveContractModal,
  },

  computed: {
    ...mapState('auth', ['registryContractApproved', 'user']),
    ...mapState('web3', ['recordContract']),

    formattedBalance() {
      return formatTokenAmount(this.user.codxBalance)
    },

    nextRequestIn() {
      const now = Date.now()
      const faucetDripNextRequestAt = new Date(this.user.faucetDripNextRequestAt).getTime()
      return timeSince(new Date(now - (faucetDripNextRequestAt - now)))
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
