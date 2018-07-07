<template>
  <b-card
    :img-src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage"
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
</template>

<script>
import EventBus from '../util/eventBus'
import { ZeroAddress } from '../util/constants/web3'
import callContract from '../util/web3/callContract'
import missingImage from '../assets/images/missing-image.png'

export default {
  name: 'record-transfer-outgoing-list-item',
  props: ['codexRecord'],
  data() {
    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      cancelApproved: false,
      missingImage,
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

.card
  flex: none
  min-width: 180px
  border: none
  margin-bottom: 1rem
  margin-top: 1rem
  border-radius: 0 0 .25rem .25rem

  @media screen and (min-width: $breakpoint-sm)
    max-width: calc((100% * 1/2) - 2rem)

  @media screen and (min-width: $breakpoint-md)
    max-width: calc((100% * 1/3) - 2rem)

  @media screen and (min-width: $breakpoint-lg)
    max-width: calc((100% * 1/4) - 2rem)

  @media screen and (min-width: $breakpoint-xl)
    max-width: calc((100% * 1/5) - 2rem)

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
