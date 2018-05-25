<template>
  <b-modal
    id="approveTokenModal"
    title="Approve Tokens"
    ok-title="Approve"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="approveTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <p>
      This will grant the Codex Viewer permission to spend CODX on your behalf.
    </p>
  </b-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'

export default {
  name: 'approve-token-modal',
  props: ['titleId'],
  data() {
    return {
      modalVisible: false,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    approveTokens(event) {
      event.preventDefault()

      const amount = new this.web3.BigNumber(2).pow(255).toFixed()
      const input = [this.titleContract.address, amount]
      callContract(this.tokenContract.approve, input, this.web3)
        .then(() => {
          this.modalVisible = false
        })
        .catch((error) => {
          console.log('There was an error approving the transfer', error)
        })
    },
    checkAllowance() {
      const input = [this.web3.account, this.titleContract.address]
      callContract(this.tokenContract.allowance, input, this.web3)
        .then((value) => {
          console.log('Amount of CODX the Codex Viewer has permission to spend on your behalf (may be higher than your balance):', value.toNumber())
        })
        .catch((error) => {
          console.log('There was an error approving the transfer', error)
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    titleContract() {
      return this.web3.titleContractInstance()
    },
    tokenContract() {
      return this.web3.tokenContractInstance()
    },
  },
  watch: {
    modalVisible(newVisibility) {
      if (newVisibility) {
        this.checkAllowance()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>

.token-icon
  width: 8rem
  margin-bottom: 2rem

</style>
