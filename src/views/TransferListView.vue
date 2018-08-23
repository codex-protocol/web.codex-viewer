<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="Transfers" />
        <app-sub-header
          :fetchData="this.fetchData"
          :transferDirection="transferDirection"
        />
        <b-card-group
          v-if="records.length"
          deck
          class="record-list"
        >
          <record-transfer-incoming-list-item
            v-if="transferDirection === 'incoming'"
            v-for="record in records"
            :codex-record="record"
            :key="record.tokenId"
          />
          <record-transfer-outgoing-list-item
            v-if="transferDirection === 'outgoing'"
            v-for="record in records"
            :codex-record="record"
            :key="record.tokenId"
          />
          <!-- TODO: add an "ignored" tab? idk probably not super necessary really -->
        </b-card-group>
        <div v-else>
          You have no {{ transferDirection }} transfers.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Transfer from '../util/api/transfer'
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
  mounted() {
    EventBus.$on('socket:codex-record:address-approved:owner', this.addOutgoingRecordHandler)
    EventBus.$on('socket:codex-record:address-approved:approved', this.addIncomingRecordHandler)
    EventBus.$on('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:codex-record:address-approved:owner', this.addOutgoingRecordHandler)
    EventBus.$off('socket:codex-record:address-approved:approved', this.addIncomingRecordHandler)
    EventBus.$off('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },
  created() {
    EventBus.$emit('events:view-transfers-page', this)
    this.fetchData(this.transferDirection)
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {

    // add the record to the incoming list if it was just approved
    addIncomingRecordHandler(codexRecordToAdd) {

      // only add the record if we're on the appropriate tab
      if (this.transferDirection !== 'incoming') {
        return
      }

      // make sure we don't introduce duplicates...
      const alreadyExists = this.records.some((codexRecord) => {
        return codexRecord.tokenId === codexRecordToAdd.tokenId
      })

      if (!alreadyExists) {
        this.records.push(codexRecordToAdd)
      }

    },

    // add the record to the outgoing list if it was just approved
    addOutgoingRecordHandler(codexRecordToAdd) {

      // only add the record if we're on the appropriate tab
      if (this.transferDirection !== 'outgoing') {
        return
      }

      // make sure we don't introduce duplicates...
      const alreadyExists = this.records.some((codexRecord) => {
        return codexRecord.tokenId === codexRecordToAdd.tokenId
      })

      if (!alreadyExists) {
        this.records.push(codexRecordToAdd)
      }
    },

    // remove the record from the outgoing list if it was just transferred
    removeTransferredRecordHandler(codexRecordToRemove) {
      this.records = this.records.filter((codexRecord) => {
        return codexRecord.tokenId !== codexRecordToRemove.tokenId
      })
    },

    fetchData(transferDirection) {

      const getTransfers = transferDirection === 'incoming'
        ? Transfer.getIncomingTransfers
        : Transfer.getOutgoingTransfers

      getTransfers()
        .then((transfers) => {
          this.records = transfers
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not fetch ${transferDirection} transfers: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.record-list
  display: flex
  flex-wrap: wrap
  margin-left: 0
  margin-right: 0

</style>
