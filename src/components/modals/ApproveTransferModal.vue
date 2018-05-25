<template>
  <b-modal id="approveTransferModal"
    title="Start title transfer"
    ok-title="Start transfer"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:shown="focusModal"
    v-on:ok="approveTransfer"
  >
    <b-form-group
      label="Type or paste wallet address"
      label-for="toEthAddress" label-size="sm"
    >
      <b-form-input
        id="toEthAddress"
        type="text"
        placeholder="e.g., 0x627306090aba..."
        ref="defaultModalFocus"
        v-model="toEthAddress"
        spellcheck="false"
      />
      <b-form-text>
        After approving a transfer, the owner of the Ethereum address will have to accept the title.
        This is the recommended way of transferring titles.
      </b-form-text>
    </b-form-group>
    <!--
    <b-form-group
      label="Email address of the wallet owner (optional)"
      label-for="toEmailAddress" label-size="sm"
    >
      <b-form-input
        id="toEmailAddress"
        type="text"
        placeholder="e.g., user@example.com"
        v-model="toEmailAddress"
      />
      <b-form-text>
        If you know the email address of the person you are approving,
        we will send them an email once they've been approved to accept the title.
      </b-form-text>
    </b-form-group>
    -->
  </b-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'

export default {
  name: 'approve-transfer-modal',
  props: ['titleId'],
  data() {
    return {
      toEthAddress: null,
      toEmailAddress: null,
      modalVisible: false,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    approveTransfer(event) {
      event.preventDefault()

      const input = [this.toEthAddress, this.titleId]
      callContract(this.titleContract.approve, input, this.web3)
        .then(() => {
          this.modalVisible = false
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
  },
  watch: {
    // When the modal dialog is closed, we reset the component data
    modalVisible(newVisibility) {
      if (!newVisibility) {
        Object.assign(this.$data, this.$options.data.apply(this))
      }
    },
  },
}
</script>
