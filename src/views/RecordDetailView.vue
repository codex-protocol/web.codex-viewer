<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div v-if="codexRecord">
          <div class="row">
            <div class="col-12 col-md-5">
              <record-image-carousel
                :codexRecord="codexRecord"
              />
            </div>
            <div class="col-12 col-md-7">
              <div>
                <div v-if="codexRecord.metadata">
                  <h1>{{ codexRecord.metadata.name }}</h1>
                  <div class="description">{{ codexRecord.metadata.description }}</div>
                </div>
                <div v-else>
                  <h1>Codex Record #{{ codexRecord.tokenId }}</h1>
                </div>
                <a href="#" @click.prevent="toggleShowDetails">Toggle details</a>
                <record-blockchain-details v-if="showDetails" :codexRecord="codexRecord" />
                <div class="mt-3 action-buttons" v-if="isOwner">
                  <b-button class="mr-2" variant="primary" v-b-modal.recordManageModal>
                    Manage
                  </b-button>

                  <b-button class="mr-2" variant="primary" v-b-modal.approveTransferModal>
                    Transfer
                  </b-button>

                  <b-button class="mr-2" variant="primary" v-b-modal.recordPrivacySettings>
                    Settings
                  </b-button>

                  <!-- @FIXME: Not wired up yet
                  <b-button variant="primary" v-if="this.isAwaitingApproval">
                    Remove Approver
                  </b-button>
                  -->

                  <record-manage-modal :codex-record="codexRecord" />
                  <approve-transfer-modal :codex-record="codexRecord" />
                  <privacy-settings-modal :codex-record="codexRecord" :onUpdated="onSettingsUpdate" />
                </div>
                <div class="mt-3" v-if="isApproved">
                  <b-button @click="acceptTransfer">
                    Accept Record transfer
                  </b-button>
                </div>
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
      </div> <!-- col-12 -->
    </div> <!-- row -->
  </div> <!-- container-fluid -->
</template>

<script>
import Record from '../util/api/record'
import { ZeroAddress } from '../util/constants/web3'
import callContract from '../util/web3/callContract'
import EventBus from '../util/eventBus'


import RecordProvenance from '../components/RecordProvenance'
import RecordManageModal from '../components/modals/RecordManageModal'
import RecordImageCarousel from '../components/RecordImageCarousel'
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
    RecordManageModal,
    RecordImageCarousel,
  },
  data() {
    return {
      showDetails: false,
      codexRecord: null,
      error: null,
      activeMainImage: null,
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
      return (
        this.account &&
        this.$store.state.auth.authToken &&
        this.account === this.codexRecord.ownerAddress
      )
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
    isAwaitingApproval() {
      return this.codexRecord.approvedAddress !== null &&
        this.codexRecord.approvedAddress !== ZeroAddress
    },
  },
  created() {
    EventBus.$emit('events:view-record-page')
    this.getRecord()
  },
  mounted() {
    EventBus.$on('socket:record-modified', this.recordModifiedHandler)
    EventBus.$on('socket:record-destroyed', this.recordDestroyedHandler)
  },
  beforeDestroy() {
    EventBus.$off('socket:record-modified', this.recordModifiedHandler)
    EventBus.$off('socket:record-destroyed', this.recordDestroyedHandler)
  },
  watch: {
    $route: 'getRecord',
  },
  methods: {
    recordModifiedHandler(updatedCodexRecord) {
      if (updatedCodexRecord.tokenId !== this.recordId) {
        return
      }
      this.codexRecord = updatedCodexRecord
      // Reset the primary displayed image to the main image
      this.activeMainImage = null
    },
    recordDestroyedHandler(destroyedCodexRecord) {
      if (destroyedCodexRecord.tokenId !== this.recordId) {
        return
      }
      // if they're viewing a record that has just been destroyed, send them
      //  back to their collection
      this.$router.replace({ name: 'collection' })
    },
    onSettingsUpdate(newCodexRecord) {
      this.codexRecord = newCodexRecord
    },
    getRecord() {
      Record.getRecord(this.recordId)
        .then((record) => {
          this.codexRecord = record
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get Record: ${error.message}`)
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
        })
    },
    toggleShowDetails() {
      this.showDetails = !this.showDetails
    },
    setMainImage(uri) {
      this.activeMainImage = uri
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.description
  white-space: pre-wrap

.action-buttons
  display: flex
  flex-direction: column

  button
    margin-bottom: 1rem

  @media screen and (min-width: $breakpoint-sm)
    flex-direction: row

    button
      margin-bottom: 1rem
</style>
