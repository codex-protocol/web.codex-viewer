<template>
  <div>
    <div v-if="codexTitle">
      <div class="flex mb-5">
        <div class="title-image">
          <img v-if="codexTitle.metadata" :src="codexTitle.metadata.files[0].uri" />
          <div class="private-img" v-else>
            <p>This Codex Title is private</p>
          </div>
        </div>
        <div class="top vertical">
          <div v-if="codexTitle.metadata">
            <h1>{{ codexTitle.metadata.name }}</h1>
            <div class="description">{{ codexTitle.metadata.description }}</div>
          </div>
          <div v-else>
            <h1>Codex Title #{{ codexTitle.tokenId }}</h1>
          </div>
          <a href="#" @click.prevent="toggleShowDetails">Toggle details</a>
          <title-blockchain-details v-if="showDetails" :codexTitle="codexTitle" />
          <div class="mt-3" v-if="isOwner">
            <!-- @FIXME: Not wired up yet
            <b-button class="mr-3" variant="primary">
              Modify
            </b-button>
            -->

            <b-button class="mr-3" variant="primary" v-b-modal.approveTransferModal>
              Transfer
            </b-button>

            <b-button class="mr-3" variant="primary" v-b-modal.titlePrivacySettings>
              Settings
            </b-button>

            <!-- @FIXME: Not wired up yet
            <b-button variant="primary" v-if="this.isAwaitingApproval">
              Remove Approver
            </b-button>
            -->

            <approve-transfer-modal :titleId="titleId" />
            <privacy-settings-modal :titleId="titleId" :isPrivate="isPrivate" />
          </div>
          <div class="mt-3" v-if="isApproved">
            <b-button @click="acceptTransfer">
              Accept title transfer
            </b-button>
          </div>
        </div>
      </div>
      <title-provenance :provenance="codexTitle.provenance" />
    </div>

    <div v-else>
      <div v-if="error">
        <p>There was an error loading title with id {{ this.titleId }}</p>
        <p>{{ this.error }}</p>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import callContract from '../util/web3/callContract'

import ApproveTransferModal from '../components/modals/ApproveTransferModal'
import PrivacySettingsModal from '../components/modals/PrivacySettingsModal'
import TitleProvenance from '../components/TitleProvenance'
import TitleBlockchainDetails from '../components/TitleBlockchainDetails'

export default {
  name: 'title-detail',
  components: {
    ApproveTransferModal,
    PrivacySettingsModal,
    TitleProvenance,
    TitleBlockchainDetails,
  },
  data() {
    return {
      codexTitle: null,
      error: null,
      showDetails: false,
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
        this.account === this.codexTitle.ownerAddress
    },
    isApproved() {
      return this.account &&
        this.account === this.codexTitle.approvedAddress
    },
    titleId() {
      return this.$route.params.titleId
    },
    contract() {
      return this.web3.contractInstance()
    },
    isPrivate() {
      return this.codexTitle.isPrivate
    },
    isAwaitingApproval() {
      return this.codexTitle.approvedAddress !== null &&
        this.codexTitle.approvedAddress !== '0x0000000000000000000000000000000000000000' // @TODO: store this in config or similar
    },
  },
  created() {
    this.fetchData()
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      axios.get(`/title/${this.titleId}?include=metadata&include=provenance`).then((response) => {
        const { result, error } = response.data
        if (error) {
          console.log('there was an error calling getTitle', error)
          this.codexTitle = null
          this.error = error
        } else {
          this.codexTitle = result
        }
      }).catch((error) => {
        console.log('there was an error calling getTitle', error)
        this.codexTitle = null
        this.error = error
      })
    },
    acceptTransfer() {
      const input = [
        this.codexTitle.ownerAddress,
        this.account,
        this.titleId,
      ]

      callContract(this.contract.safeTransferFrom, input, this.web3)
        .then(() => {
        })
        .catch((error) => {
          console.log('There was an error accepting the transfer', error)
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

.title-image
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
