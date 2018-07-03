<template>
  <div>
    <div v-if="codexRecord">
      <div class="flex">
        <div class="record-image">
          <div class="record-image-wrap">
            <b-img
              fluid
              v-if="codexRecord.metadata"
              :src="mainImageUri"
            />
            <div class="private-img" v-else>
              <p>This Codex Record is private</p>
            </div>
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
            <b-button class="mr-3" variant="primary" v-b-modal.recordManageModal>
              Manage
            </b-button>

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
            <record-manage-modal
              :codexRecord="codexRecord"
            />
          </div>
          <div class="mt-3" v-if="isApproved">
            <b-button @click="acceptTransfer">
              Accept Record transfer
            </b-button>
          </div>
        </div>
      </div>
      <div
        v-if="codexRecord.metadata && codexRecord.metadata.images.length"
        class="record-extra-images mb-5"
      >
        <b-img
          class="record-extra-image"
          thumbnail
          fluid
          :src="codexRecord.metadata.mainImage.uri"
          @click.prevent="setMainImage(codexRecord.metadata.mainImage.uri)"
          alt="Thumbnail"
        />
        <b-img
          v-if="codexRecord.metadata.images"
          v-for="image in codexRecord.metadata.images"
          v-bind:key="image.id"
          ref="images"
          class="record-extra-image"
          thumbnail
          fluid
          :src="image.uri"
          @click.prevent="setMainImage(image.uri)"
          alt="Thumbnail"
        />
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
import Record from '../util/api/record'
import { ZeroAddress } from '../util/constants/web3'
import callContract from '../util/web3/callContract'
import EventBus from '../util/eventBus'

import missingImage from '../assets/images/missing-image.png'
import RecordProvenance from '../components/RecordProvenance'
import RecordManageModal from '../components/modals/RecordManageModal'
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
  },
  data() {
    return {
      showDetails: false,
      codexRecord: null,
      error: null,
      missingImage,
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
    mainImageUri() {
      return (this.activeMainImage) ||
        (this.codexRecord.metadata.mainImage ? this.codexRecord.metadata.mainImage.uri : missingImage)
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
  margin: 0 2rem 2rem 0

  .record-image-wrap
    display: flex
    align-items: start
    width: 25rem
    height: 25rem

.record-extra-images
  display: inline-block

.record-extra-image
  max-width: 10rem

  &:hover
    cursor: pointer

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
