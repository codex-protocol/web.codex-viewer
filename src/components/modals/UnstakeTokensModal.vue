<template>
  <meta-mask-notification-modal
    id="unstakeTokensModal"
    title="Unstake tokens"
    ok-title="Unstake"
    :ok-disabled="!canSubmit"
    cancel-variant="outline-primary"
    :ok-method="unstakeTokens"
    :on-shown="focusModal"
    :on-clear="clearModal"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <b-form-group
      :label="`Number of tokens to unstake (Current stake: ${currentStake} CODX)`"
      label-for="unstakeAmount"
      label-size="sm"
    >
      <b-form-input
        required
        id="unstakeAmount"
        ref="unstakeAmount"
        type="number"
        class="mb-4"
        placeholder="Number of tokens"
        v-model="unstakeAmount"
      />
    </b-form-group>
  </meta-mask-notification-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'unstake-tokens-modal',
  props: ['currentStake'],
  components: {
    MetaMaskNotificationModal,
  },
  data() {
    return {
      unstakeAmount: null,
    }
  },
  methods: {
    focusModal() {
      this.$refs.unstakeAmount.focus()
    },
    unstakeTokens() {

      const amount = this.web3.instance().toWei(this.unstakeAmount, 'ether')
      const input = [amount, '0x0']

      EventBus.$emit('events:click-unstake-tokens')

      return callContract(this.stakeContract.unstake, input, this.web3)
        .then(() => {
          EventBus.$emit('events:unstake-tokens', { amount })
        })
        .catch((error) => {
          console.error('Could not unstake tokens:', error)

          // @NOTE: we must throw the error here so the MetaMaskNotificationModal
          //  can catch() it too
          throw error
        })
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    canSubmit() {
      return this.unstakeAmount
    },
    stakeContract() {
      return this.web3.stakeContainerContractInstance()
    },
  },
}
</script>

<style lang="stylus" scoped>
.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
