<template>
  <MetaMaskNotificationModal
    id="approveTransferModal"
    title="Transfer Codex Record"
    ok-title="Start transfer"
    cancel-variant="outline-primary"
    :ok-method="approveTransfer"
    :on-shown="onShow"
    :on-clear="clearModal"
    :requires-tokens="true"
    :validate="validate"
  >

    <b-form-group
      v-if="showEthereumAddressField"
      label="Type or paste wallet address"
      label-for="toEthAddress"
      label-size="sm"
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
        After approving a transfer, the owner of the Ethereum address can accept
        the Record.
      </b-form-text>
    </b-form-group>

    <b-form-group
      v-else
      label="Email address of the wallet owner"
      label-for="toEmailAddress" label-size="sm"
    >
      <b-form-input
        id="toEmailAddress"
        type="text"
        placeholder="e.g., user@example.com"
        v-model="toEmailAddress"
      />
      <b-form-text>
        If you know the email address of the person you are approving, we will
        send them an email once they've been approved to accept the Record.
      </b-form-text>
    </b-form-group>

    <b-button
      size="sm"
      variant="link"
      class="pl-0 pr-0"
      v-if="user.type !== 'savvy'"
      @click="toggleField()"
    >
      Transfer to an {{ showEthereumAddressField ? 'email' : 'Ethereum' }} address instead?
    </b-button>

  </MetaMaskNotificationModal>
</template>

<script>
import { mapState } from 'vuex'

import contractHelper from '../../util/contractHelper'
import EventBus from '../../util/eventBus'
import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'ApproveTransferModal',

  props: {
    codexRecord: Object,
  },

  components: {
    MetaMaskNotificationModal,
  },

  data() {
    return {
      toEthAddress: null,
      toEmailAddress: null,
      showEthereumAddressField: false,
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['instance']),
  },

  methods: {

    onShow() {
      if (this.user.type === 'savvy') {
        this.showEthereumAddressField = true
      }

      if (this.$refs.defaultModalFocus) {
        this.$refs.defaultModalFocus.focus()
      }
    },

    clearModal() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },

    toggleField() {

      // savvy users aren't allowed to switch fields, since they can only
      //  specify Ethereum addresses for approve()
      if (this.user.type === 'savvy') {
        this.showEthereumAddressField = true
        return
      }

      this.toEthAddress = null
      this.toEmailAddress = null
      this.showEthereumAddressField = !this.showEthereumAddressField
    },

    validate() {
      const errors = []

      if (this.showEthereumAddressField) {
        if (!this.toEthAddress) {
          errors.push('Ethereum address is required')
        } else if (this.toEthAddress === this.user.address) {
          errors.push('You cannot transfer to yourself')
        } else if (this.toEthAddress === this.codexRecord.approvedAddress) {
          errors.push('This address has already been approved for transfer')
        } else if (!this.instance.utils.isAddress(this.toEthAddress)) {
          errors.push('Invalid Ethereum address')
        }
        return errors
      }

      if (!this.toEmailAddress) {
        errors.push('Email address is required')
      } else if (this.toEmailAddress === this.user.email) {
        errors.push('You cannot transfer to yourself')
      }

      return errors
    },

    approveTransfer() {
      EventBus.$emit('events:record-click-transfer', this)

      const input = [
        this.showEthereumAddressField ? this.toEthAddress : this.toEmailAddress,
        this.codexRecord.tokenId,
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'approve', input, this.$store)
        .then(() => {
          EventBus.$emit('events:record-transfer', this)
        })
    },
  },
}
</script>
