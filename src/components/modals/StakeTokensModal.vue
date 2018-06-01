<template>
  <b-modal
    id="stakeTokensModal"
    title="Stake tokens"
    ok-title="Stake"
    :ok-disabled="!canSubmit()"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="stakeTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <b-form-group
      label="Number of tokens to stake" label-for="stakeAmount" label-size="sm"
    >
      <b-form-input
        required
        id="stakeAmount"
        type="text"
        class="mb-4"
        placeholder="Number of tokens"
        ref="defaultModalFocus"
        v-model="stakeAmount"
      />
    </b-form-group>
  </b-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'

export default {
  name: 'stake-tokens-modal',
  data() {
    return {
      stakeAmount: null,
      modalVisible: false,
    }
  },
  methods: {
    canSubmit() {
      return this.stakeAmount
    },
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    stakeTokens(event) {
      event.preventDefault()

      const input = [this.web3.instance().toWei(this.stakeAmount, 'ether'), '0x0']
      callContract(this.stakeContract.stake, input, this.web3)
        .then(() => {
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error staking tokens', error)
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
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
