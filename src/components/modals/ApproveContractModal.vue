<template>
  <b-modal
    :id="id"
    title="Approve tokens"
    ok-title="Approve"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="approveTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <slot></slot>
  </b-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'

export default {
  name: 'approve-contract-modal',
  props: ['id', 'contractInstance', 'stateProperty'],
  data() {
    return {
      modalVisible: false,
    }
  },
  methods: {
    approveTokens(event) {
      event.preventDefault()

      const amount = new (this.web3.instance()).BigNumber(2).pow(255)
      const input = [this.contractInstance.address, amount.toFixed()]

      callContract(this.tokenContract.approve, input, this.web3)
        .then(() => {
          this.$store.commit('updateApprovalStatus', {
            allowance: amount,
            stateProperty: this.stateProperty,
            BigNumber: this.web3.instance().BigNumber,
          })
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error approving the contract', error)
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
