<template>
  <b-card
    v-if="!codexRecord.isIgnored"
    :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
    img-top
  >
    <div class="accepted-overlay" v-if="this.transferAccepted">
      <p>Transfer Accepted</p>
      <b-button variant="secondary" @click.prevent="viewRecord">View Asset</b-button>
    </div>
    <p class="name"><a href="#" @click.prevent="viewRecord">{{ codexRecord.metadata.name }}</a></p>
    <p class="address">Sent from {{ codexRecord.ownerAddress }}</p>
    <p class="action-buttons">
      <b-button variant="secondary" @click.prevent="acceptTransfer" :disabled="this.isLoading">Accept</b-button>
      <b-button variant="outline-primary" @click.prevent="ignoreTransfer" :disabled="this.isLoading">Ignore</b-button>
    </p>
  </b-card>
</template>

<script>

import Transfer from '../util/api/transfer'
import EventBus from '../util/eventBus'
import callContract from '../util/web3/callContract'
import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'record-transfer-incoming-list-item',
  props: ['codexRecord'],
  data() {
    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      transferAccepted: false,
      isLoading: false,
      missingImageHelper,
    }
  },
  mounted() {
    EventBus.$on('socket:codex-record:transferred:new-owner', this.recordTransferredHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:codex-record:transferred:new-owner', this.recordTransferredHandler)
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    recordContract() {
      return this.web3.recordContractInstance()
    },
  },
  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },
    // show the "transfer accepted" overlay when the transfer event comes in
    recordTransferredHandler(codexRecord) {
      if (this.codexRecord.tokenId !== codexRecord.tokenId) {
        return
      }
      this.transferAccepted = true
      this.isLoading = false
    },
    acceptTransfer() {

      const input = [
        this.codexRecord.ownerAddress,
        this.web3.account,
        this.codexRecord.tokenId,
      ]

      this.isLoading = true
      EventBus.$emit('events:click-accept-transfer')

      callContract(this.recordContract.safeTransferFrom, input, this.web3)
        .then(() => {

          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)
          EventBus.$emit('events:accept-transfer')

          // @NOTE: leave the in the loading state so that they can't click the
          //  buttons while the transaction is waiting to be mined
          //
          // @TODO: figure out a way to persit this across route changes (local
          //  storage?)
          //
          // this.isLoading = false

        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not accept transfer: ${error.message}`)
          this.isLoading = false
        })
    },
    ignoreTransfer() {

      this.isLoading = true

      Transfer.ignoreIncomingTransfer(this.codexRecord.tokenId)
        .then((record) => {
          this.codexRecord.isIgnored = record.isIgnored
          EventBus.$emit('toast:success', 'Transfer ignored successfully!', 5000)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not ignore transfer: ${error.message}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()
  min-width: 180px

  &.is-loading
    opacity: .5

  .accepted-overlay
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    position: absolute
    width: 100%
    height: 100%
    top: 0
    left: 0
    background-color: $color-primary

    p
      font-weight: 600

  a
    font-weight: bold
    color: $color-dark

    &:hover
      text-decoration: none

  p
    color: $color-secondary

    &.name
      font-weight: 600

    &.address
      font-weight: 300

  .action-buttons
    button
      width: 100%

      &+button
        margin-top: 1rem

</style>
