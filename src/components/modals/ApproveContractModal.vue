<template>
  <meta-mask-notification-modal
    :id="id"
    title="Approve contract"
    ok-title="Approve"
    cancel-variant="outline-primary"
    :ok-method="approveTokens"
  >
    <div class="text-center">
      <img class="token-icon" src="../../assets/icons/codx-token.svg">
    </div>
    <slot></slot>
    <p class="mt-5">
      <a :href="getAddressUrl()" target="_blank">View contract on Etherscan</a>
    </p>
  </meta-mask-notification-modal>
</template>

<script>
import { mapState } from 'vuex'

import EventBus from '../../util/eventBus'
import callContract from '../../util/web3/callContract'
import etherscanHelper from '../../util/web3/etherscanHelper'

import MetaMaskNotificationModal from './MetaMaskNotificationModal'

export default {
  name: 'approve-contract-modal',

  props: ['id', 'contract', 'stateProperty'],

  components: {
    MetaMaskNotificationModal,
  },

  computed: {
    ...mapState('web3', ['instance', 'tokenContract']),
  },

  methods: {
    approveTokens() {
      EventBus.$emit('events:click-approve-contract', this)
      const amount = new (this.instance).BigNumber(2).pow(255)
      const input = [this.contract.address, amount.toFixed()]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return callContract(this.tokenContract.approve, input)
        .then(() => {
          EventBus.$emit('events:approve-contract', this)
          this.$store.commit('auth/SET_APPROVAL_STATUS', {
            allowance: amount,
            stateProperty: this.stateProperty,
          })
        })
    },
    getAddressUrl() {
      return etherscanHelper.getAddressUrl(this.contract.address)
    },
  },
}
</script>

<style lang="stylus" scoped>
.token-icon
  width: 8rem
  margin-bottom: 2rem
</style>
