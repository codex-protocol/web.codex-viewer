<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="Collection">
          <b-button
            variant="primary"
            v-b-modal.createRecordModal
          >
            Add New Asset
          </b-button>

          <b-button
            variant="outline-primary"
            @click="createGiveaway"
            v-if="showCreateGiveawayButton && !giveaway"
          >
            Create giveaway
          </b-button>
        </app-header>
        <b-card-group deck class="record-list">
          <faucet-marketing-card :giveaway="giveaway" v-if="!hideSetup && !giveaway" />
          <claim-giveaway-card :giveaway="giveaway" />
          <giveaway-info-card :giveaway="giveaway" />

          <record-list-item
            v-if="record.metadata"
            v-for="record in records"
            :codex-record="record"
            :key="record.tokenId"
          />
        </b-card-group>
        <create-record-modal />
      </div>
    </div>
  </div>
</template>

<script>
import config from '../util/config'
import EventBus from '../util/eventBus'
import Record from '../util/api/record'
import Giveaway from '../util/api/giveaway'

import AppHeader from '../components/AppHeader'
import RecordListItem from '../components/RecordListItem'
import GiveawayInfoCard from '../components/GiveawayInfoCard'
import ClaimGiveawayCard from '../components/ClaimGiveawayCard'
import FaucetMarketingCard from '../components/FaucetMarketingCard'
import CreateRecordModal from '../components/modals/CreateRecordModal'

export default {
  name: 'record-list',
  components: {
    AppHeader,
    RecordListItem,
    FaucetMarketingCard,
    ClaimGiveawayCard,
    GiveawayInfoCard,
    CreateRecordModal,
  },
  data() {
    return {
      records: [],
      giveaway: null,
      showCreateGiveawayButton: config.showCreateGiveawayButton,
    }
  },
  computed: {
    account() {
      return this.$store.state.web3.account
    },
    hideSetup() {
      return !config.showFaucet || this.$store.state.auth.hideSetup
    },
  },
  mounted() {
    // @NOTE: incoming transfers and newly minted Records both have the same
    //  effect of pushing the new record onto this.records, so we use the same
    //  handler for both
    //
    // the same concept applies for outgoing transfers and destroyed records
    EventBus.$on('socket:codex-record:minted', this.addTransferredRecordHandler)
    EventBus.$on('socket:codex-record:destroyed', this.removeTransferredRecordHandler)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$on('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:codex-record:minted', this.addTransferredRecordHandler)
    EventBus.$off('socket:codex-record:destroyed', this.removeTransferredRecordHandler)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$off('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },
  created() {
    this.getRecords()
    this.getGiveaways()
    EventBus.$emit('events:view-collection-page', this)
  },
  methods: {
    // add the record to the collection if it was just transferred
    addTransferredRecordHandler(codexRecordToAdd) {

      // if this was the record created by the giveaway, hide the giveaway card
      if (this.giveaway && codexRecordToAdd.metadata.description === this.giveaway.editionDetails.description) {
        this.giveaway = null
      }

      this.records.push(codexRecordToAdd)
    },
    // add the record from the collection if it was just transferred
    removeTransferredRecordHandler(codexRecordToRemove) {
      this.records = this.records.filter((codexRecord) => {
        return codexRecord.tokenId !== codexRecordToRemove.tokenId
      })
    },
    getRecords() {
      Record.getUserRecords()
        .then((records) => {
          this.records = records
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
        })
    },
    getGiveaways() {
      Giveaway.getAllEligibleGiveaways()
        .then((giveaways) => {
          // For now, just select the first giveaway that is available
          this.giveaway = giveaways[0]
        })
    },
    createGiveaway() {
      Giveaway.createNewGiveaway()
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not create giveaway: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.record-list
  display: flex
  flex-wrap: wrap
  align-items: start

</style>
