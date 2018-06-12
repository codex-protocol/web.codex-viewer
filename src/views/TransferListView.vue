<template>
  <div>
    <app-header title="Transfers" />
    <app-sub-header
      v-bind:transferDirection="transferDirection"
      v-bind:fetchData="this.fetchData"
    />
    <b-card-group deck class="record-list" v-if="records.length">
      <record-transfer-incoming-list-item
        v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
        v-if="transferDirection === 'incoming'"
      />
      <record-transfer-outgoing-list-item
        v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
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
import EventBus from '../util/eventBus'
import AppHeader from '../components/AppHeader'
import AppSubHeader from '../components/AppSubHeader'
import RecordTransferIncomingListItem from '../components/RecordTransferIncomingListItem'
import RecordTransferOutgoingListItem from '../components/RecordTransferOutgoingListItem'

export default {
  name: 'record-list',
  props: ['transferDirection'],
  components: {
    AppHeader,
    AppSubHeader,
    RecordTransferIncomingListItem,
    RecordTransferOutgoingListItem,
  },
  data() {
    return {
      records: [],
    }
  },
  created() {
    EventBus.$emit('events:view-transfers-page')
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
        },
      }

      if (transferDirection === 'incoming') {
        requestOptions.params.filters.isIgnored = false
      }

      axios(requestOptions)
        .then((response) => {
          const { result } = response.data
          this.records = result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not fetch ${transferDirection} transfers: ${error.message}`)
          console.error(`could not fetch ${transferDirection} transfers`, error)
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
    word-wrap: break-word

h1, h2
  display: inline

.record-list
  display: flex
  flex-wrap: wrap

</style>
