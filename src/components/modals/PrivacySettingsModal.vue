<template>
  <b-modal
    id="titlePrivacySettings"
    title="Title privacy settings"
    ok-title="Save"
    cancel-variant="outline-primary"
    v-model="modalVisible"
    v-on:ok="saveSettings"
  >
    <b-form-group
      label="Share Title Publicly"
      label-for="togglePrivacy"
      label-size="sm"
    >
      <input
        type="checkbox"
        class="toggle-checkbox"
        v-model="titleIsPublic"
      />
      <b-form-text>
        By making your title public, everyone can view the title, description and image of this title.
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
import axios from 'axios'

export default {
  name: 'privacy-settings-modal',
  props: ['titleId', 'isPrivate', 'whitelistedAddresses'],
  data() {
    return {
      modalVisible: false,
      titleIsPublic: !this.isPrivate,
      newWhitelistedAddress: null,
      sharedAddresses: this.whitelistedAddresses,
    }
  },
  computed: {
    web3() {
      return this.$store.state.web3
    },
  },
  methods: {
    removeWhitelistedAddress(address) {
      const sharedAddresses = this.sharedAddresses.filter((sharedAddress) => {
        return sharedAddress !== address
      })

      const url = `/users/titles/${this.titleId}`
      axios.put(url, {
        whitelistedAddresses: sharedAddresses,
      }).then((response) => {
        const { error } = response.data
        if (error) {
          console.log('there was an error removing whitelisted address', error)
          // @TODO: better error messaging
        } else {
          this.newWhitelistedAddress = null
          this.sharedAddresses = sharedAddresses
        }
      }).catch((error) => {
        console.log('there was an error removing whitelisted address', error)
        // @TODO: better error messaging
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

      const url = `/users/titles/${this.titleId}`
      axios.put(url, {
        isPrivate: !this.titleIsPublic,
        whitelistedAddresses: this.sharedAddresses,
      }).then((response) => {
        const { error } = response.data
        if (error) {
          console.log('there was an error setting title privacy', error)
          // @TODO: better error messaging
          // Reset toggle on error
          this.titleIsPublic = !this.titleIsPublic
          this.newWhitelistedAddress = null
        } else {
          this.modalVisible = false
          this.newWhitelistedAddress = null
        }
      }).catch((error) => {
        console.log('there was an error setting title privacy', error)
        // @TODO: better error messaging
        // Reset toggle on error
        this.titleIsPublic = !this.titleIsPublic
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
