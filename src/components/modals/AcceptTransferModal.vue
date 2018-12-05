<template>
  <MetaMaskNotificationModal
    id="acceptTransferModal"
    title="Accept Codex Record"
    ok-title="Accept transfer"
    cancel-variant="outline-primary"
    :ok-method="acceptTransfer"
    :requires-tokens="true"
    :checkout-cost="codxCosts.CodexRecord.safeTransferFrom"
    checkout-title="Accept Codex Record"
  >
    <template slot="checkout" v-if="codexRecord">
      <h3>{{ codexRecord.metadata.name }}</h3>
      <div class="image-container">
        <img :src="codexRecord.metadata | getMainImageUri" />
      </div>
      <div class="description">{{ codexRecord.metadata.description }}</div>
    </template>

    <p>
      Accepting this Codex Record will add it to your collection.
      As soon as it is added to your collection it will become private.
    </p>

    <p>You have full control over what you can do with the Codex Record after it's added to your collection.</p>
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

  computed: {
    ...mapState('app', ['codxCosts']),
    ...mapState('auth', ['user']),
    ...mapState('records', ['onTransferCallback']),
  },

  methods: {
    acceptTransfer() {
      const input = [
        this.codexRecord.ownerAddress,
        this.user.address,
        this.codexRecord.tokenId,
      ]

      // @NOTE: we don't .catch here so that the error bubbles up to MetaMaskNotificationModal
      return contractHelper('CodexRecord', 'safeTransferFrom', input, this.$store)
        .then(() => {
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)

          // @NOTE: leave the in the loading state so that they can't click the
          //  buttons while the transaction is waiting to be mined
          //
          // @TODO: figure out a way to persit this across route changes (local
          //  storage?)
          //
          // this.isLoading = false

          if (typeof this.onTransferCallback === 'function') {
            this.onTransferCallback()
          }
        })
    },
  },
}
</script>
