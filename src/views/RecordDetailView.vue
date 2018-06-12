<template>
  <div>
    <div v-if="codexRecord">
      <div class="flex mb-5">
        <div class="record-image">
          <img v-if="codexRecord.metadata" :src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage" />
          <div class="private-img" v-else>
            <p>This Codex Record is private</p>
          </div>
        </div>
        <div class="top vertical">
          <div v-if="codexRecord.metadata">
            <h1>{{ codexRecord.metadata.name }}</h1>
            <div class="description">{{ codexRecord.metadata.description }}</div>
          </div>
          <div v-else>
            <h1>Codex Record #{{ codexRecord.tokenId }}</h1>
          </div>
          <a href="#" @click.prevent="toggleShowDetails">Toggle details</a>
          <record-blockchain-details v-if="showDetails" :codexRecord="codexRecord" />
          <div class="mt-3" v-if="isOwner">
            <!-- @FIXME: Not wired up yet
            <b-button class="mr-3" variant="primary">
              Modify
            </b-button>
            -->

            <b-button class="mr-3" variant="primary" v-b-modal.approveTransferModal>
              Transfer
            </b-button>

            <b-button class="mr-3" variant="primary" v-b-modal.recordPrivacySettings>
              Settings
            </b-button>

            <!-- @FIXME: Not wired up yet
            <b-button variant="primary" v-if="this.isAwaitingApproval">
              Remove Approver
            </b-button>
            -->

            <approve-transfer-modal :recordId="recordId" />
            <privacy-settings-modal
              :recordId="recordId"
              :isPrivate="isPrivate"
              :whitelistedAddresses="whitelistedAddresses"
            />
          </div>
          <div class="mt-3" v-if="isApproved">
            <b-button @click="acceptTransfer">
              Accept Record transfer
            </b-button>
          </div>
        </div>
      </div>
      <record-provenance :provenance="codexRecord.provenance" />
    </div>

    <div v-else>
      <div v-if="error">
        <p>There was an error loading Record with id {{ this.recordId }}</p>
        <p>{{ this.error }}</p>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { ZeroAddress } from '../util/constants/web3'
import callContract from '../util/web3/callContract'
import EventBus from '../util/eventBus'

import missingImage from '../assets/images/missing-image.png'
import RecordProvenance from '../components/RecordProvenance'
import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import RecordBlockchainDetails from '../components/RecordBlockchainDetails'

export default {
  name: 'record-detail',
  components: {
    ApproveTransferModal,
    PrivacySettingsModal,
    RecordProvenance,
    RecordBlockchainDetails,
  },
  data() {
    return {
      showDetails: false,
      codexRecord: null,
      error: null,
      missingImage,
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
    account() {
      return this.web3.account
    },
    isOwner() {
      return this.account &&
        this.account === this.codexRecord.ownerAddress
    },
    isApproved() {
      return this.account &&
        this.account === this.codexRecord.approvedAddress
    },
    recordId() {
      return this.$route.params.recordId
    },
    recordContract() {
      return this.web3.recordContractInstance()
    },
    isPrivate() {
      return this.codexRecord.isPrivate
    },
    whitelistedAddresses() {
      return this.codexRecord.whitelistedAddresses
    },
    isAwaitingApproval() {
      return this.codexRecord.approvedAddress !== null &&
        this.codexRecord.approvedAddress !== ZeroAddress
    },
  },
  created() {
    EventBus.$emit('events:view-record-page')
    this.getRecord()
  },
  watch: {
    $route: 'getRecord',
  },
  methods: {
    getRecord() {
      axios.get(`/record/${this.recordId}`)
        .then((response) => {
          this.codexRecord = response.data.result
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get Record: ${error.message}`)
          console.error('Could not get Record:', error)
          this.codexRecord = null
          this.error = error
        })
    },
    acceptTransfer() {
      const input = [
        this.codexRecord.ownerAddress,
        this.account,
        this.recordId,
      ]

      callContract(this.recordContract.safeTransferFrom, input, this.web3)
        .then(() => {
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)
          EventBus.$emit('events:accept-transfer')
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not accept transfer: ${error.message}`)
          console.error('Could not accept transfer:', error)
        })
    },
    toggleShowDetails() {
      this.showDetails = !this.showDetails
    },
  },
}
</script>

<style lang="stylus" scoped>
.flex
  display: flex
  flex-direction: row
  align-items: baseline

.top
  flex-grow: 1
  align-self: flex-start

.vertical
  display: flex
  flex-direction: column
  align-items: baseline

.record-image
  height: 50vh
  min-width: 40%
  max-width: 50%
  margin: 0 2rem 2rem 0

  img
    width: 100%
    max-height: 100%
    object-fit: contain

.description
  white-space: pre-wrap

.private-img
  width: 320px
  height: 320px
  display: flex
  text-align: center
  align-items: center
  justify-content: center
  background-color: #32194C

  >p
    color: white
    padding: 2em
    font-size: 2rem
</style>
