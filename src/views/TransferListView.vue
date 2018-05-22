<template>
  <div>
    <app-header title="Transfers" />
    <app-sub-header
      v-bind:transferDirection="transferDirection"
      v-bind:fetchData="this.fetchData"
    />
    <b-card-group deck class="title-list" v-if="titles.length">
      <title-transfer-incoming-list-item
        v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
        v-if="transferDirection === 'incoming'"
      />
      <title-transfer-outgoing-list-item
        v-for="title in titles"
        :codex-title="title"
        :key="title.tokenId"
        v-if="transferDirection === 'outgoing'"
      />
      <!-- TODO: add an "ignored" tab? idk probably not super necessary really -->
    </b-card-group>
    <div v-else>
      You have no {{ transferDirection }} transfers.
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from '../components/AppHeader'
import AppSubHeader from '../components/AppSubHeader'
import TitleTransferIncomingListItem from '../components/TitleTransferIncomingListItem'
import TitleTransferOutgoingListItem from '../components/TitleTransferOutgoingListItem'

export default {
  name: 'title-list',
  props: ['transferDirection'],
  components: {
    AppHeader,
    AppSubHeader,
    TitleTransferIncomingListItem,
    TitleTransferOutgoingListItem,
  },
  data() {
    return {
      titles: [],
    }
  },
  created() {
    this.fetchData(this.transferDirection)
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    fetchData(transferDirection) {

      const requestOptions = {

        method: 'get',
        url: `/user/transfers/${transferDirection}`,

        params: {
          filters: {},
          include: [
            'metadata',
          ],
        },
      }

      if (transferDirection === 'incoming') {
        requestOptions.params.filters.isIgnored = false
      }

      axios(requestOptions)
        .then((response) => {

          const { error, result } = response.data

          if (error) {
            throw error
          }

          this.titles = result

        })
        .catch((error) => {
          console.error(`there was an error fetching ${transferDirection} transfers`, error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  height: 2.5rem
  font-size: 2.5rem
  margin-bottom: 2rem
  color: $color-primary

  display: flex
  align-items: center

  h1
    font-size: 1em
    font-weight: bold
    line-height: 1em
    font-family: $font-family-serif

    margin: 0 .5em 0 0
    padding-right: .5em
    border-right: 1px solid $color-primary

  .network-details
    font-size: .4em
    word-break: break-word

h1, h2
  display: inline

.title-list
  display: flex
  flex-wrap: wrap

</style>
