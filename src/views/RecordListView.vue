<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <AppHeader title="Collection">
          <b-button
            variant="primary"
            v-b-modal.createRecordModal
          >
            Add New Asset
          </b-button>

          <b-button
            variant="outline-primary"
            @click="createGiveaway"
            v-if="showCreateGiveawayButton"
          >
            Create giveaway
          </b-button>
        </AppHeader>
        <b-card-group deck class="record-list">
          <FaucetMarketingCard v-if="showFaucetMarketingCard" />

          <template v-if="giveaway">
            <ClaimGiveawayCard :giveaway="giveaway" />
            <GiveawayInfoCard :giveaway="giveaway" />
          </template>

          <!-- If there are no marketing cards displayed the user has no records, show a 'how-to' card -->
          <CreateRecordCard v-if="!giveaway && recordList.length === 0" />
          <template v-else>
            <RecordListItem
              v-for="record in recordList"
              :codex-record="record"
              :key="record.tokenId"
            />
          </template>
        </b-card-group>
        <create-record-modal />
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'

import config from '../util/config'
import EventBus from '../util/eventBus'
import Record from '../util/api/record'
import Giveaway from '../util/api/giveaway'

import AppHeader from '../components/core/AppHeader'

import GiveawayInfoCard from '../components/cards/GiveawayInfoCard'
import CreateRecordCard from '../components/cards/CreateRecordCard'
import ClaimGiveawayCard from '../components/cards/ClaimGiveawayCard'
import FaucetMarketingCard from '../components/cards/FaucetMarketingCard'


import RecordListItem from '../components/RecordListItem'
import CreateRecordModal from '../components/modals/CreateRecordModal'

export default {
  name: 'RecordListView',

  components: {
    AppHeader,

    GiveawayInfoCard,
    CreateRecordCard,
    ClaimGiveawayCard,
    FaucetMarketingCard,

    RecordListItem,
    CreateRecordModal,
  },

  data() {
    return {
      records: [],
      giveaway: null,
    }
  },

  mounted() {
    // @NOTE: incoming transfers and newly created Records both have the same
    //  effect of pushing the new record onto this.records, so we use the same
    //  handler for both
    //
    // the same concept applies for outgoing transfers and destroyed records
    EventBus.$on('socket:codex-record:created', this.addTransferredRecordHandler)
    EventBus.$on('socket:codex-record:destroyed', this.removeTransferredRecordHandler)
    EventBus.$on('socket:codex-record:transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$on('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-record:created', this.addTransferredRecordHandler)
    EventBus.$off('socket:codex-record:destroyed', this.removeTransferredRecordHandler)
    EventBus.$off('socket:codex-record:transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$off('socket:codex-record:transferred:old-owner', this.removeTransferredRecordHandler)
  },

  created() {
    this.getRecords()
    this.getGiveaways()
  },

  computed: {
    ...mapState('auth', ['hideSetup']),
    ...mapGetters('auth', ['isAdmin', 'isSimpleUser']),

    recordList() {
      return this.records.filter((record) => {
        return !!record.metadata
      })
    },

    showCreateGiveawayButton() {
      return this.isAdmin && !this.giveaway
    },

    showFaucetMarketingCard() {
      return config.showFaucet && !this.isSimpleUser && !this.hideSetup && !this.giveaway
    },
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
