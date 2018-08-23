<template>
  <b-modal
    id="recordPrivacySettings"
    title="Record privacy settings"
    ok-title="Save"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="updateRecord"
    @hidden="onHide"
  >
    <b-form-group
      label="Share Record Publicly"
      label-for="isPublic"
      label-size="sm"
    >
      <input
        id="isPublic"
        type="checkbox"
        v-model="isPublic"
        class="toggle-checkbox"
        @change="toggleIsPrivate"
      />
      <b-form-text>
        By making this Record public, everyone can view the title, description and images for this Record.
      </b-form-text>
    </b-form-group>
    <b-form-group
      v-if="user && user.isGalleryEnabled"
      label="Include Record in Gallery"
      label-for="isInGallery"
      label-size="sm"
    >
      <input
        id="isInGallery"
        type="checkbox"
        v-model="isInGallery"
        class="toggle-checkbox"
        @change="toggleIsInGallery"
      />
      <b-form-text>
        Make this Record public, and list it on your personal gallery page.
      </b-form-text>
    </b-form-group>

    <hr>

    <b-form-group
      label="Grant Read-Only Access"
      label-for="address"
      label-size="sm"
    >
      <b-form-text>
        Wallet Address
      </b-form-text>
      <b-input-group class="grant-access">
        <b-form-input
          id="address"
          type="text"
          placeholder="e.g. 0x627306090aba..."
          v-model="newWhitelistedAddress"
          spellcheck="false"
        />
        <b-input-group-append>
          <b-btn variant="primary" @click="addWhitelistedAddress()">Add</b-btn>
        </b-input-group-append>
      </b-input-group>

      <div class="mt-4">
        <div v-if="whitelistedAddresses.length > 0">
          <div v-for="address in whitelistedAddresses" :key="address">
            <hash-formatter :data="address" />
            <span class="close" v-on:click="removeWhitelistedAddress(address)">×</span>
          </div>
        </div>
        <div v-else>
          <small class="text-muted">
            You have not shared this record with any other addresses. Add one above to allow read-only access for that address.
          </small>
        </div>
      </div>

    </b-form-group>
  </b-modal>
</template>

<script>
import debug from 'debug'

import HashFormatter from '../HashFormatter'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'

const logger = debug('app:component:privacy-settings-modal')

export default {
  name: 'privacy-settings-modal',
  props: ['codexRecord', 'onUpdated'],
  components: {
    HashFormatter,
  },
  data() {
    return {
      modalVisible: false,
      newWhitelistedAddress: null,
      isPrivate: this.codexRecord.isPrivate,
      isInGallery: this.codexRecord.isInGallery,
      whitelistedAddresses: Array.from(this.codexRecord.whitelistedAddresses) || [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    web3() {
      return this.$store.state.web3
    },
    isPublic: {
      get: function getIsPublic() {
        return !this.isPrivate
      },
      set: function setIsPublic(newValue) {
        this.isPrivate = !newValue
      },
    },
  },
  methods: {
    onHide() {
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    toggleIsPrivate() {
      if (this.isPrivate) {
        this.isInGallery = false
      }
    },
    toggleIsInGallery() {
      if (this.isInGallery) {
        this.isPrivate = false
      }
    },
    addWhitelistedAddress() {

      const addressToAdd = this.newWhitelistedAddress

      if (
        addressToAdd !== null &&
        !this.whitelistedAddresses.includes(addressToAdd) &&
        addressToAdd.toLowerCase() !== this.web3.account.toLowerCase()
      ) {
        this.whitelistedAddresses.push(addressToAdd)
      }

      this.newWhitelistedAddress = null

    },
    removeWhitelistedAddress(addressToRemove) {
      this.whitelistedAddresses = this.whitelistedAddresses.filter((whitelistedAddress) => {
        return whitelistedAddress !== addressToRemove
      })
    },
    updateRecord(event) {

      event.preventDefault()

      // if they typed in an address but didn't click "add", add it for them
      if (this.newWhitelistedAddress !== null) {
        this.addWhitelistedAddress()
      }

      const dataToUpdate = {
        isPrivate: this.isPrivate,
        isInGallery: this.isInGallery,
        whitelistedAddresses: this.whitelistedAddresses,
      }

      Record.updateRecord(this.codexRecord.tokenId, dataToUpdate)
        .then((result) => {
          this.modalVisible = false
          if (typeof this.onUpdated === 'function') this.onUpdated(result)
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record: ${error.message}`)
          logger('Could not update Record:', error)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.grant-access
  display: flex
  flex-direction: column

  input
    width: 100%
    margin-bottom: 1rem

  @media screen and (min-width: $breakpoint-sm)
    flex-direction: row

    input
      width: auto
      margin-bottom: 0
      margin-right: 1rem

.close
  position: relative
  margin-top: -15px !important

  @media screen and (min-width: $breakpoint-sm)
    margin-top: -3px !important

</style>
