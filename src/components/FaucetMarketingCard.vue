<template>
  <div class="faucet-card">
    <b-card no-body>
      <div class="faucet-card-body">
        <p>
          <b>Finish setting up</b>
        </p>
        <ul>
          <li>Get some CODX from the faucet!</li>
          <li>Approve the registry contract</li>
        </ul>
        <p>Your balance: {{ formatTokenAmount(balance) }} CODX</p>
      </div>
      <b-button
        variant="primary"
        :disabled="currentStep === numSteps"
        @click.prevent="completeStep"
      >
        {{ buttonText }}
      </b-button>
    </b-card>

    <approve-contract-modal
      id="approveRegistryModal"
      :contractInstance="recordContract"
      stateProperty="registryContractApproved"
    >
      This will grant the Codex Viewer permission to spend CODX on your behalf.
    </approve-contract-modal>
    <faucet-modal />
  </div>
</template>

<script>
import formatTokenAmount from '../util/formatTokenAmount'

import ApproveContractModal from './modals/ApproveContractModal'
import FaucetModal from './modals/FaucetModal'

export default {
  name: 'faucet-marketing-card',
  components: {
    ApproveContractModal,
    FaucetModal,
  },
  data() {
    return {
      numSteps: 2,
    }
  },
  computed: {
    currentStep() {
      if (this.balance.eq(0)) {
        return 0
      }

      if (!this.registryContractApproved) {
        return 1
      }

      return 2
    },
    balance() {
      return this.$store.state.auth.balance
    },
    registryContractApproved() {
      return this.$store.state.auth.registryContractApproved
    },
    recordContract() {
      return this.$store.state.web3.recordContractInstance()
    },
    buttonText() {
      switch (this.currentStep) {
        case 0:
          return 'Get CODX'

        case 1:
          return 'Approve the registry contract'

        case 2:
        default:
          return 'Setup complete!'
      }
    },
  },
  methods: {
    completeStep() {
      switch (this.currentStep) {
        case 0:
          this.$root.$emit('bv::show::modal', 'faucetModal')
          break

        case 1:
          this.$root.$emit('bv::show::modal', 'approveRegistryModal')
          break

        default:
          break
      }
    },
    formatTokenAmount(rawAmount) {
      return formatTokenAmount(rawAmount)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.faucet-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  .card
    height: 100%
    border-radius: 0 0 .25rem .25rem
    background-color: rgba(white, .1)

  button
    margin: 1.25rem

.faucet-card-body
  padding: 1.25rem
  flex: 1

  .card-body
    text-align: left

ul
  padding-left: 1rem
</style>
