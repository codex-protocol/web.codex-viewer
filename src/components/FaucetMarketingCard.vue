<template>
  <div class="faucet-card">
    <b-card no-body>
      <div class="faucet-card-body">
        <h2>Finish setting up your account</h2>
        <b-progress
          class="mt-4 mb-4"
          :value="currentStep"
          :max="numSteps"
          variant="success"
        />
        <ul>
          <li :class="{ 'completed': currentStep >= 1 }">Participate in the giveaway</li>
          <li :class="{ 'completed': currentStep >= 2 }">Get CODX from the faucet</li>
          <li :class="{ 'completed': currentStep >= 3 }">Approve the registry contract</li>
        </ul>
        <p>Your balance: {{ formatTokenAmount(balance) }} CODX</p>
      </div>
      <b-button
        variant="primary"
        :disabled="done"
        @click.prevent="completeStep"
      >
        {{ buttonText }}
      </b-button>
      <p class="dismiss">
        <a href="#" @click.prevent="hide">Hide this</a>
      </p>
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
      numSteps: 3,
    }
  },
  computed: {
    done() {
      return this.currentStep === this.numSteps
    },
    currentStep() {
      if (this.balance.eq(0)) {
        return 1
      }

      if (!this.registryContractApproved) {
        return 2
      }

      return 3
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
        case 1:
          return 'Get CODX'

        case 2:
          return 'Approve Contract'

        case 3:
        default:
          return 'Setup complete!'
      }
    },
  },
  methods: {
    completeStep() {
      switch (this.currentStep) {
        case 1:
          this.$root.$emit('bv::show::modal', 'faucetModal')
          break

        case 2:
          this.$root.$emit('bv::show::modal', 'approveRegistryModal')
          break

        default:
          break
      }
    },
    hide() {
      this.$store.dispatch('hideSetup')
    },
    formatTokenAmount(rawAmount) {
      return formatTokenAmount(rawAmount)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

h2
  font-weight: bold
  font-size: 1.25rem
  color: $color-light

.card
  height: 100%
  border-radius: .25rem
  background-color: rgba(white, .1)

.faucet-card-body
  flex: 1
  text-align: left
  padding: 1.25rem 1.25rem 0

  p:last-of-type
    margin-bottom: 0

button
  margin: 1.25rem
  white-space: normal

ul
  font-size: 1.125rem

li
  margin-bottom: 1rem

  &.completed
    opacity: .5
    text-decoration: line-through

.dismiss
  font-size: 0.75rem
  text-align: center
</style>
