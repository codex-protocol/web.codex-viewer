<template>
  <MetaMaskNotificationModal
    id="unstakeTokensModal"
    title="Unstake Tokens"
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
  </MetaMaskNotificationModal>
</template>

<script>
import { mapState } from 'vuex'
import callContract from '../../util/web3/callContract'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {

  props: ['currentStake'],

  components: {
    MetaMaskNotificationModal,
  },

  data() {
    return {
      unstakeAmount: {
        type: Number,
        default: null,
      },
    }
  },

  methods: {
    focusModal() {
      this.$refs.unstakeAmount.focus()
    },
    unstakeTokens() {

      const amount = this.instance.utils.toWei(this.unstakeAmount, 'ether')
      const input = [amount, '0x0']

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return callContract(this.stakeContract.methods.unstake(...input))
        .then(() => {
          EventBus.$emit('events:unstake-tokens', this.unstakeAmount)
        })
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
  },

  computed: {
    ...mapState('web3', ['instance', 'stakeContract']),

    canSubmit() {
      return this.unstakeAmount
    },
  },
}
</script>

<style lang="stylus" scoped>
.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
