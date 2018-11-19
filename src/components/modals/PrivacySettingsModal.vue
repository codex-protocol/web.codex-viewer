<template>
  <b-modal
    id="recordPrivacySettings"
    title="Record privacy settings"
    ok-title="Save"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="updateRecord"
    @hidden="onHide"
    @shown="onShow"
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
        By making this Record public, anyone can view the name, description and images.
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
      <div v-if="showEthereumAddressField">
        <b-form-text>
          Wallet Address
        </b-form-text>
        <b-input-group class="grant-access">
          <b-form-input
            id="address"
            type="text"
            spellcheck="false"
            v-model="newWhitelistedAddress"
            placeholder="e.g. 0x627306090aba..."
          />
          <b-input-group-append>
            <b-button variant="primary" @click="addWhitelistedAddress()">Add</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <div v-else>
        <b-form-text>
          Email Address
        </b-form-text>
        <b-input-group class="grant-access">
          <b-form-input
            id="email"
            type="email"
            spellcheck="false"
            v-model="newWhitelistedEmail"
            placeholder="e.g., user@example.com"
          />
          <b-input-group-append>
            <b-button variant="primary" @click="addWhitelistedEmail()">Add</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>

      <b-button
        size="sm"
        variant="link"
        class="pl-0 pr-0"
        v-if="supportEmailAccounts"
        @click="toggleWhitelistField()"
      >
        Share with an {{ showEthereumAddressField ? 'email' : 'Ethereum' }} address instead?
      </b-button>

      <div class="mt-4">
        <div v-if="whitelistedAddresses.length > 0">
          <div v-for="address in whitelistedAddresses" :key="address">
            <DisplayName :name="address" />
            <span class="close" v-on:click="removeWhitelistedAddress(address)">×</span>
          </div>
        </div>
        <div v-if="whitelistedEmails.length > 0">
          <div v-for="email in whitelistedEmails" :key="email">
            <DisplayName :name="email" />
            <span class="close" @click="removeWhitelistedEmail(email)">×</span>
          </div>
        </div>
        <div v-if="whitelistedAddresses.length === 0 && whitelistedEmails.length === 0">
          <small class="text-muted">
            You have not shared this record with any other addresses. Add one above to allow read-only access for that address.
          </small>
        </div>
      </div>

    </b-form-group>
  </b-modal>
</template>

<script>
import { mapState } from 'vuex'
import debug from 'debug'

import config from '../../util/config'
import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'
import DisplayName from '../util/DisplayName'

const logger = debug('app:component:privacy-settings-modal')

export default {
  name: 'privacy-settings-modal',

  props: ['codexRecord', 'onUpdated'],

  components: {
    DisplayName,
  },

  data() {
    return {
      modalVisible: false,
      newWhitelistedEmail: null,
      newWhitelistedAddress: null,
      showEthereumAddressField: true,
      isPrivate: this.codexRecord.isPrivate,
      isInGallery: this.codexRecord.isInGallery,
      supportEmailAccounts: config.supportEmailAccounts,
      whitelistedEmails: Array.from(this.codexRecord.whitelistedEmails) || [],
      whitelistedAddresses: Array.from(this.codexRecord.whitelistedAddresses) || [],
    }
  },

  computed: {
    ...mapState('auth', ['user']),
    ...mapState('web3', ['instance']),

    // it's more verbose to do this, but it makes passing isPrivate much more
    //  intuitive than isPublic
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

    onShow() {
      // by default, show the ethereum address field to savvy users and the email
      //  field to simple users
      if (this.user.type !== 'savvy' && config.supportEmailAccounts) {
        this.showEthereumAddressField = false
      }
    },

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

    toggleWhitelistField() {
      this.toEthAddress = null
      this.toEmailAddress = null
      this.showEthereumAddressField = !this.showEthereumAddressField
    },

    addWhitelistedAddress(addressToAdd = this.newWhitelistedAddress) {

      if (
        this.instance.utils.isAddress(addressToAdd) && // this also handles null values
        !this.whitelistedAddresses.includes(addressToAdd) &&
        addressToAdd.toLowerCase() !== this.user.address.toLowerCase()
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

    addWhitelistedEmail(emailToAdd = this.newWhitelistedEmail) {

      if (
        emailToAdd !== null &&
        !this.whitelistedEmails.includes(emailToAdd) &&
        (!this.user.email || emailToAdd.toLowerCase() !== this.user.email.toLowerCase())
      ) {
        this.whitelistedEmails.push(emailToAdd)
      }

      this.newWhitelistedEmail = null

    },

    removeWhitelistedEmail(emailToRemove) {
      this.whitelistedEmails = this.whitelistedEmails.filter((whitelistedEmail) => {
        return whitelistedEmail !== emailToRemove
      })
    },

    updateRecord(event) {
      event.preventDefault()

      // if they typed in an email but didn't click "add", add it for them
      if (this.newWhitelistedEmail !== null) {
        this.addWhitelistedEmail()
      }

      // if they typed in an address but didn't click "add", add it for them
      if (this.newWhitelistedAddress !== null) {
        this.addWhitelistedAddress()
      }

      const dataToUpdate = {
        isPrivate: this.isPrivate,
        isInGallery: this.isInGallery,
        whitelistedEmails: this.whitelistedEmails,
        whitelistedAddresses: this.whitelistedAddresses,
      }

      Record.updateRecord(this.codexRecord.tokenId, dataToUpdate)
        .then((result) => {
          this.modalVisible = false

          if (typeof this.onUpdated === 'function') {
            this.onUpdated(result)
          }
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
