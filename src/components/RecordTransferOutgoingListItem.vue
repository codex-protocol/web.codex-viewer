<template>
  <div class="record-card">
    <b-card
      :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
      img-top
    >
      <div class="approved-overlay" v-if="this.cancelApproved">
        <p>Transfer Cancelled</p>
        <b-button variant="secondary" @click.prevent="viewRecord">View Asset</b-button>
      </div>
      <p class="name"><a href="#" @click.prevent="viewRecord">{{ codexRecord.metadata.name }}</a></p>
      <p class="address">Sent to {{ codexRecord.approvedAddress }}</p>
      <p class="action-buttons">
        <b-button variant="outline-primary" @click.prevent="cancelTransfer">Cancel</b-button>
      </p>
    </b-card>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import { ZeroAddress } from '../util/constants/web3'
import callContract from '../util/web3/callContract'
import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'record-transfer-outgoing-list-item',
  props: ['codexRecord'],
  data() {
    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      cancelApproved: false,
      missingImageHelper,
    }
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
    cancelTransfer() {
      EventBus.$emit('events:click-cancel-transfer')
      const input = [ZeroAddress, this.codexRecord.tokenId]

      callContract(this.recordContract.approve, input, this.web3)
        .then(() => {
          EventBus.$emit('events:cancel-transfer')
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)
          this.cancelApproved = true
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not cancel transfer: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.record-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  .card
    border: none
    border-radius: 0 0 .25rem .25rem

  .approved-overlay
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

  img
    width: 100%
    max-height: 25vw // good enough ¯\_(ツ)_/¯
    min-height: 25vh // good enough ¯\_(ツ)_/¯
    object-fit: cover

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
