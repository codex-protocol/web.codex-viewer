<template>
  <div class="title-card">
    <b-card
      :img-src="codexTitle.metadata.files[0].uri"
      img-top
    >
      <div class="approved-overlay" v-if="this.cancelApproved">
        <p>Transfer Cancelled</p>
        <b-button variant="secondary" @click.prevent="viewTitle">View Asset</b-button>
      </div>
      <p class="name"><a href="#" @click.prevent="viewTitle">{{ codexTitle.metadata.name }}</a></p>
      <p class="action-buttons">
        <b-button variant="outline-primary" @click.prevent="cancelTransfer">Cancel</b-button>
      </p>
    </b-card>
  </div>
</template>

<script>
import callContract from '../util/web3/callContract'

export default {
  name: 'title-transfer-outgoing-list-item',
  props: ['codexTitle'],
  data() {
    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.tokenId } },
      cancelApproved: false,
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    contract() {
      return this.web3.contractInstance()
    },
  },
  methods: {
    viewTitle() {
      this.$router.push(this.route)
    },
    cancelTransfer() {
      const input = ['0x0000000000000000000000000000000000000000', this.codexTitle.tokenId]

      callContract(this.contract.approve, input, this.web3)
        .then(() => {
          this.cancelApproved = true
        })
        .catch((error) => {
          console.log('There was an error cancelling the transfer', error)
        })
    },
    ignoreTransfer() {
      // @TODO: Implement ignoring transfer
      console.log('ignore transfer')
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.title-card
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
    object-fit: contain

  a
    font-weight: bold
    color: $color-dark

    &:hover
      text-decoration: none

  p
    color: $color-secondary

    &.name
      font-weight: 600

  .action-buttons
    display: flex
    justify-content: space-between

</style>
