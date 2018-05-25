<template>
  <div
    class="title-card"
    v-if="!codexTitle.isIgnored"
    :class="{ 'is-loading': this.isLoading }"
  >
    <b-card
      :img-src="codexTitle.metadata.mainImage.uri"
      img-top
    >
      <div class="accepted-overlay" v-if="this.transferAccepted">
        <p>Transfer Accepted</p>
        <b-button variant="secondary" @click.prevent="viewTitle">View Asset</b-button>
      </div>
      <p class="name"><a href="#" @click.prevent="viewTitle">{{ codexTitle.metadata.name }}</a></p>
      <p class="address">Sent from {{ codexTitle.ownerAddress }}</p>
      <p class="action-buttons">
        <b-button variant="secondary" @click.prevent="acceptTransfer">Accept</b-button>
        <b-button variant="outline-primary" @click.prevent="ignoreTransfer">Ignore</b-button>
      </p>
    </b-card>
  </div>
</template>

<script>

import axios from 'axios'
import callContract from '../util/web3/callContract'

export default {
  name: 'title-transfer-incoming-list-item',
  props: ['codexTitle'],
  data() {
    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.tokenId } },
      transferAccepted: false,
      isLoading: false,
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    titleContract() {
      return this.web3.titleContractInstance()
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

      callContract(this.titleContract.safeTransferFrom, input, this.web3)
        .then(() => {
          this.transferAccepted = true
        })
        .catch((error) => {
          console.log('There was an error accepting the transfer', error)
        })
    },
    ignoreTransfer() {

      const requestOptions = {

        method: 'put',
        url: `/user/transfers/incoming/${this.codexTitle.tokenId}`,

        data: {
          isIgnored: true,
        },
      }

      this.isLoading = true

      axios(requestOptions)
        .then((response) => {

          if (response instanceof Error) {
            throw response
          }

          const { error, result } = response.data

          if (error) {
            throw error
          }

          this.codexTitle.isIgnored = result.isIgnored

        })
        .catch((error) => {
          console.error('there was an error ignoring this transfer', error)
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

.title-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  &.is-loading
    opacity: .5

  .card
    border: none
    border-radius: 0 0 .25rem .25rem

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

    &.address
      font-weight: 300

  .action-buttons
    button
      width: 100%

      &+button
        margin-top: 1rem

</style>
