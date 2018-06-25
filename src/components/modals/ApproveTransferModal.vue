<template>
  <meta-mask-notification-modal
    id="approveTransferModal"
    title="Start Record transfer"
    ok-title="Start transfer"
    cancel-variant="outline-primary"
    :ok-method="approveTransfer"
    :on-shown="focusModal"
    :on-clear="clearModal"
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
        After approving a transfer, the owner of the Ethereum address will have to accept the Record.
        This is the recommended way of transferring Records.
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
        we will send them an email once they've been approved to accept the Record.
      </b-form-text>
    </b-form-group>
    -->
  </meta-mask-notification-modal>
</template>

<script>
import callContract from '../../util/web3/callContract'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'approve-transfer-modal',
  props: ['recordId'],
  components: {
    MetaMaskNotificationModal,
  },
  data() {
    return {
      toEthAddress: null,
      toEmailAddress: null,
    }
  },
  methods: {
    focusModal() {
      this.$refs.defaultModalFocus.focus()
    },
    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    approveTransfer() {
      EventBus.$emit('events:record-click-transfer')
      const input = [this.toEthAddress, this.recordId]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return callContract(this.recordContract.approve, input, this.web3)
        .then(() => {
          EventBus.$emit('events:record-transfer')
        })
    },
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    recordContract() {
      return this.web3.recordContractInstance()
    },
  },
}
</script>
