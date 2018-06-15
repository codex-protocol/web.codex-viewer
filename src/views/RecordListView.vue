<template>
  <div>
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
    <b-card-group deck class="record-list" v-if="records.length">
      <record-list-item
        v-for="record in records"
        :codex-record="record"
        :key="record.tokenId"
      />
    </b-card-group>
    <b-card-group deck class="record-list giveaway-container" v-else-if="giveaway">
      <b-card
        img-top
        class="giveaway"
        :img-src="giveaway.editionDetails.mainImage ? giveaway.editionDetails.mainImage.uri : missingImage"
      >
        <div class="overlay" v-if="isLoading">
          <img class="spinner" src="../assets/images/spinner.svg" />
        </div>
        <b-button
          variant="secondary"
          @click="acceptGiveaway"
          :disabled="disableGiveawayButton"
        >
          Create Record
        </b-button>
      </b-card>
      <b-card class="info">
        <p>
          The first {{ giveaway.numberOfEditions }} users to participate in the Beta will receive an edition of this piece created by our designer Seb!
        </p>
        <p>
          Click the 'Create Record' button to the left to claim yours.
        </p>
        <p>
          After the transaction has been mined by the blockchain (which may take a few minutes) your new Codex Record will appear in your collection.
        </p>
      </b-card>
    </b-card-group>
    <div v-else>
      You have no Records in your collection!
    </div>
    <create-record-modal />
  </div>
</template>

<script>
import axios from 'axios'
import missingImage from '../assets/images/missing-image.png'

import EventBus from '../util/eventBus'
import AppHeader from '../components/AppHeader'
import RecordListItem from '../components/RecordListItem'
import { showCreateGiveawayButton } from '../util/config'
import CreateRecordModal from '../components/modals/CreateRecordModal'

export default {
  name: 'record-list',
  components: {
    AppHeader,
    RecordListItem,
    CreateRecordModal,
  },
  data() {
    return {
      records: [],
      missingImage,
      giveaway: null,
      isLoading: false,
      showCreateGiveawayButton,
      disableGiveawayButton: false,
    }
  },
  computed: {
    account() {
      return this.$store.state.web3.account
    },
  },
  mounted() {
    // @NOTE: incoming transfers and newly minted Records both have the same
    //  effect of pushing the new record onto this.records, so we use the same
    //  handler for both
    EventBus.$on('socket:mint-confirmed', this.addTransferredRecordHandler)
    EventBus.$on('socket:record-transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$on('socket:record-transferred:old-owner', this.removeTransferredRecordHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:mint-confirmed', this.addTransferredRecordHandler)
    EventBus.$off('socket:record-transferred:new-owner', this.addTransferredRecordHandler)
    EventBus.$off('socket:record-transferred:old-owner', this.removeTransferredRecordHandler)
  },
  created() {
    this.getRecords()
    this.getGiveaways()
    EventBus.$emit('events:view-collection-page')
  },
  methods: {
    // add the record to the collection if it was just transferred
    addTransferredRecordHandler(codexRecordToAdd) {
      this.records.push(codexRecordToAdd)
    },
    // add the record from the collection if it was just transferred
    removeTransferredRecordHandler(codexRecordToRemove) {
      this.records = this.records.filter((codexRecord) => {
        return codexRecord.tokenId !== codexRecordToRemove.tokenId
      })
    },
    getRecords() {
      axios.get('/user/records')
        .then((response) => {
          this.records = response.data.result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get collection: ${error.message}`)
          console.error('Could not get collection:', error)
        })
    },
    getGiveaways() {
      axios.get('/giveaways')
        .then((response) => {
          if (response.data.result.length) {
            // For now, just select the first giveaway that is available
            this.giveaway = response.data.result[0]
          }
        })
    },
    createGiveaway() {
      axios.post('/giveaways')
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not create giveaway: ${error.message}`)
          console.error('Could not create giveaway:', error)
        })
    },
    acceptGiveaway() {
      // No need to toggle these off later--the toast will clean them up
      this.disableGiveawayButton = true
      this.isLoading = true

      axios.post(`/user/giveaway/${this.giveaway.id}`)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not claim edition: ${error.message}`)
          console.error('Could not claim edition:', error)
          this.disableGiveawayButton = false
          this.isLoading = false
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

  > div
    flex: none
    width: 25%
    text-align: center

.info
  background: $color-dark
  border: 1px solid $color-light

  div
    display: flex
    flex-direction: column
    justify-content: center

.giveaway
  position: relative

  .card-body
    display: flex
    align-items: center
    justify-content: center

.overlay
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 998
  display: flex
  position: absolute
  align-items: center
  justify-content: center
  background-color: rgba(255, 255, 255, .75)

.spinner
  width: 8em
  height: 8em
  z-index: 999
  animation: spin 1s linear infinite reverse

@keyframes spin
  from
    transform: rotate(0deg)

  to
    transform: rotate(360deg)
</style>
