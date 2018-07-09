<template>
  <meta-mask-notification-modal
    :id="id"
    title="Approve contract"
    ok-title="Approve"
    cancel-variant="outline-primary"
    :ok-method="approveTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <slot></slot>
    <p class="mt-5">
      <a :href="getAddressUrl()" target="_blank">View contract on Etherscan</a>
    </p>
  </meta-mask-notification-modal>
</template>

<script>
import EventBus from '../../util/eventBus'
import callContract from '../../util/web3/callContract'
import etherscanHelper from '../../util/web3/etherscanHelper'

import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'approve-contract-modal',
  props: ['id', 'contractInstance', 'stateProperty'],
  components: {
    MetaMaskNotificationModal,
  },
  methods: {
    approveTokens() {
      EventBus.$emit('events:click-approve-contract', { id: this.id })
      const amount = new (this.web3.instance()).BigNumber(2).pow(255)
      const input = [this.contractInstance.address, amount.toFixed()]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return callContract(this.tokenContract.approve, input, this.web3)
        .then(() => {
          EventBus.$emit('events:approve-contract', { id: this.id })
          this.$store.commit('updateApprovalStatus', {
            allowance: amount,
            stateProperty: this.stateProperty,
          })
        })
    },
    getAddressUrl() {
      return etherscanHelper.getAddressUrl(this.contractInstance.address)
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    tokenContract() {
      return this.web3.tokenContractInstance()
    },
  },
}
</script>

<style lang="stylus" scoped>
.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
