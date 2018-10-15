<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div v-if="codexRecord">
          <div class="row">
            <div class="col-12 col-md-5">
              <RecordImageCarousel
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

                <div class="owner-action-buttons action-buttons" v-if="isOwner">
                  <b-button variant="primary" v-b-modal.recordManageModal>
                    Edit
                  </b-button>

                  <b-button variant="primary" v-b-modal.approveTransferModal>
                    Transfer
                  </b-button>

                  <b-button variant="primary" v-b-modal.recordPrivacySettings>
                    Settings
                  </b-button>

                  <record-manage-modal :codex-record="codexRecord" />
                  <ApproveTransferModal :codex-record="codexRecord" />
                  <privacy-settings-modal :codex-record="codexRecord" :onUpdated="onSettingsUpdate" />
                </div>

                <div class="public-action-buttons action-buttons">
                  <b-button @click="copyShareLink" ref="copy-share-link-button">Copy Share Link</b-button>
                  <b-button @click="toggleShowDetails">Toggle Details</b-button>
                </div>

                <div class="approved-action-buttons action-buttons" v-if="isApproved">
                  <b-button variant="primary" @click="acceptTransfer">
                    Accept Transfer
                  </b-button>
                </div>

                <RecordBlockchainDetails v-if="showDetails" :codexRecord="codexRecord" />
              </div>
            </div>
          </div>
          <RecordProvenance :provenance="codexRecord.provenance" />
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
import { mapState } from 'vuex'

import Record from '../util/api/record'
import EventBus from '../util/eventBus'
import { ZeroAddress } from '../util/constants/web3'
import contractHelper from '../util/contractHelper'
import copyToClipboard from '../util/copyToClipboard'

import RecordProvenance from '../components/RecordProvenance'
import RecordManageModal from '../components/modals/RecordManageModal'
import RecordImageCarousel from '../components/RecordImageCarousel'
import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import RecordBlockchainDetails from '../components/RecordBlockchainDetails'

export default {
  name: 'RecordDetailView',

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
      error: null,
      codexRecord: null,
      showDetails: false,
    }
  },

  created() {
    EventBus.$emit('events:view-record-page', this)
    this.getRecord()
  },

  mounted() {
    EventBus.$on('socket:codex-record:modified', this.recordModifiedHandler)
    EventBus.$on('socket:codex-record:destroyed', this.recordDestroyedHandler)
  },

  beforeDestroy() {
    EventBus.$off('socket:codex-record:modified', this.recordModifiedHandler)
    EventBus.$off('socket:codex-record:destroyed', this.recordDestroyedHandler)
  },

  computed: {
    ...mapState('auth', ['user', 'authToken']),

    isOwner() {
      return (
        this.user &&
        this.authToken &&
        this.codexRecord.ownerAddress &&
        this.user.address.toLowerCase() === this.codexRecord.ownerAddress.toLowerCase()
      )
    },

    isApproved() {
      return (
        this.user &&
        this.codexRecord.approvedAddress &&
        this.user.address.toLowerCase() === this.codexRecord.approvedAddress.toLowerCase()
      )
    },

    recordId() {
      return this.$route.params.recordId
    },

    isAwaitingApproval() {
      return this.codexRecord.approvedAddress !== null &&
        this.codexRecord.approvedAddress !== ZeroAddress
    },
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
        this.user.address,
        this.recordId,
      ]

      return contractHelper('CodexRecord', 'safeTransferFrom', input, this.$store)
        .then(() => {
          EventBus.$emit('toast:success', 'Transaction submitted successfully!', 5000)
          EventBus.$emit('events:accept-transfer', this)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not accept transfer: ${error.message}`)
        })
    },

    toggleShowDetails() {
      this.showDetails = !this.showDetails
    },

    copyShareLink() {
      copyToClipboard(window.location.href, 'Share link copied to clipboard!')
      this.$refs['copy-share-link-button'].focus()
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

h1
  padding-top: 1rem
  line-height: 1em

.description
  margin-bottom: 1rem
  white-space: pre-wrap

.action-buttons
  display: flex
  flex-wrap: wrap

  button
    margin-right: .5rem
    margin-bottom: 1rem

    @media screen and (max-width: $breakpoint-md)
      width: 100%
      margin-right: 0

</style>
