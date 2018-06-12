<template>
  <b-modal
    id="metaMaskModal"
    :title="errorContent.title"
    v-model="modalVisible"
    @hide="preventHide"
  >
    <div class="text-center">
      <img class="icon" src="../../assets/images/metamask.png" />
      <p>{{ errorContent.description }}</p>
    </div>
    <div slot="modal-footer"></div>
  </b-modal>
</template>

<script>
import { Web3Errors } from '../../store/modules/web3'
import { ExpectedNetworkId, Networks } from '../../util/constants/web3'

export default {
  name: 'meta-mask-modal',
  data() {
    return {
      modalVisible: !!this.web3Error,
    }
  },
  computed: {
    web3Error() {
      return this.$store.state.web3.error
    },
    errorContent() {
      let title = 'MetaMask is missing or locked'
      let description = 'To continue, install or unlock MetaMask'

      switch (this.web3Error) {
        case Web3Errors.Missing:
          title = 'MetaMask is missing'
          description = 'To continue, install MetaMask'
          break

        case Web3Errors.Locked:
          title = 'MetaMask is locked'
          description = 'To continue, unlock MetaMask'
          break

        case Web3Errors.WrongNetwork:
          title = 'Wrong MetaMask network'
          description = `You're on the wrong MetaMask network. Expected network is ${Networks[ExpectedNetworkId]}`
          break

        case Web3Errors.None:
        default:
          break
      }

      return { title, description }
    },
  },
  watch: {
    web3Error(newValue) {
      this.modalVisible = !!newValue
    },
  },
  methods: {
    preventHide(event) {
      if (this.web3Error) {
        event.preventDefault()
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.icon
  width: 8rem
  margin-bottom: 2rem

</style>
