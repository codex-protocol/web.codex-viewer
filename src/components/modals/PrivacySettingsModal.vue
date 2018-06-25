<template>
  <b-modal
    id="recordPrivacySettings"
    title="Record privacy settings"
    ok-title="Save"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="saveSettings"
    @hidden="onHide"
  >
    <b-form-group
      label="Share Record Publicly"
      label-for="togglePrivacy"
      label-size="sm"
    >
      <input
        type="checkbox"
        class="toggle-checkbox"
        v-model="recordIsPublic"
      />
      <b-form-text>
        By making your Record public, everyone can view the Record, description and image of this Record.
      </b-form-text>
    </b-form-group>
    <b-form-group
      label="Shared With"
      label-size="sm"
      v-if="sharedAddresses.length !== 0"
    >
      <div v-for="address in sharedAddresses" :key="address">
        <div>
          <span>{{ address }}</span>
          <span class="close" v-on:click="removeWhitelistedAddress(address)">x</span>
        </div>
      </div>
    </b-form-group>
    <b-form-group
      label="Add New Viewer"
      label-for="address"
      label-size="sm"
    >
      <b-form-text>
        Wallet Address
      </b-form-text>
      <b-form-input
        id="address"
        type="text"
        class="mb-4"
        placeholder="0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
        v-model="newWhitelistedAddress"
        spellcheck="false"
      />
    </b-form-group>
  </b-modal>
</template>

<script>

import Record from '../../util/api/record'
import EventBus from '../../util/eventBus'

export default {
  name: 'privacy-settings-modal',
  props: ['recordId', 'isPrivate', 'whitelistedAddresses'],
  data() {
    return {
      modalVisible: false,
      recordIsPublic: !this.isPrivate,
      newWhitelistedAddress: null,
      sharedAddresses: this.whitelistedAddresses || [],
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    onHide() {
      // @BUG: there's a bug here related to resetting this.sharedAddresses
      //  to the this.whitelistedAddresses prop since the prop cannot be
      //  updated to the updated value returned from the API from inside this
      //  component
      //
      // to reproduce: remove an address, close the modal, reopen the modal
      //  and note that the address is still there (even though it truly was
      //  removed from the database)
      Object.assign(this.$data, this.$options.data.apply(this))
    },
    removeWhitelistedAddress(address) {

      const whitelistedAddresses = this.sharedAddresses.filter((sharedAddress) => {
        return sharedAddress !== address
      })

      const dataToUpdate = {
        whitelistedAddresses,
      }

      Record.updateRecord(this.recordId, dataToUpdate)
        .then((result) => {
          this.newWhitelistedAddress = null
          this.sharedAddresses = result.whitelistedAddresses
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not remove whitelisted address: ${error.message}`)
          console.error('Could not remove whitelisted address:', error)
        })
    },
    saveSettings(event) {

      event.preventDefault()

      if (
        this.newWhitelistedAddress !== null &&
        !this.sharedAddresses.includes(this.newWhitelistedAddress) &&
        this.newWhitelistedAddress.toLowerCase() !== this.web3.account.toLowerCase()
      ) {
        this.sharedAddresses.push(this.newWhitelistedAddress)
      }

      const dataToUpdate = {
        isPrivate: !this.recordIsPublic,
        whitelistedAddresses: this.sharedAddresses,
      }

      Record.updateRecord(this.recordId, dataToUpdate)
        .then((result) => {

          this.modalVisible = false
          this.newWhitelistedAddress = null
          this.sharedAddresses = result.whitelistedAddresses
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record: ${error.message}`)
          console.error('Could not update record:', error)

          // Reset toggle on error
          this.recordIsPublic = !this.isPrivate
          this.newWhitelistedAddress = null
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
.close
  position: relative
  margin-top: -3px

</style>
