<template>
  <div class="title-card">
    <b-card
      :img-src="codexTitle.metadata.files[0].uri"
      img-top
    >
      <div class="approved-overlay" v-if="this.transferApproved">
        <p>Transfer Accepted</p>
        <b-button variant="secondary" @click.prevent="viewTitle">View Asset</b-button>
      </div>
      <p class="name"><a href="#" @click.prevent="viewTitle">{{ codexTitle.metadata.name }}</a></p>
      <p class="owner-address">Sent from {{ codexTitle.ownerAddress }}</p>
      <p class="action-buttons">
        <b-button variant="secondary" @click.prevent="acceptTransfer">Accept</b-button>
        <!-- @TODO: implement ignore once API allows it
        <b-button variant="secondary" @click.prevent="ignoreTransfer">Ignore</b-button>
        -->
      </p>
    </b-card>
  </div>
</template>

<script>
import callContract from '../util/web3/callContract'

export default {
  name: 'title-transfer-incoming-list-item',
  props: ['codexTitle'],
  data() {
    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.tokenId } },
      transferApproved: false,
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
    acceptTransfer() {
      const input = [
        this.codexTitle.ownerAddress,
        this.web3.account,
        this.codexTitle.tokenId,
      ]

      callContract(this.contract.safeTransferFrom, input, this.web3)
        .then(() => {
          this.transferApproved = true
        })
        .catch((error) => {
          console.log('There was an error approving the transfer', error)
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

    &.owner-address
      font-weight: 300

  .action-buttons
    display: flex
    justify-content: space-between

</style>
