<template>
  <meta-mask-notification-modal
    :id="id"
    title="Approve tokens"
    ok-title="Approve"
    cancel-variant="outline-primary"
    :ok-method="approveTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <slot></slot>
  </meta-mask-notification-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'
import EventBus from '../../util/eventBus'
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

      return callContract(this.tokenContract.approve, input, this.web3)
        .then(() => {
          EventBus.$emit('events:approve-contract', { id: this.id })
          this.$store.commit('updateApprovalStatus', {
            allowance: amount,
            stateProperty: this.stateProperty,
          })
        })
        .catch((error) => {
          console.error('Could not approve tokens:', error)

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
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
