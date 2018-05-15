<template>
  <b-modal
    id="titlePrivacySettings"
    title="Title Privacy Settings"
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
  </b-modal>
</template>

<script>
import axios from 'axios'

export default {
  name: '',
  props: ['titleId', 'isPrivate'],
  data() {
    return {
      modalVisible: false,
      titleIsPublic: !this.isPrivate,
    }
  },
  methods: {
    saveSettings(event) {
      event.preventDefault()

      const url = `/users/titles/${this.titleId}`
      axios.put(url, {
        isPrivate: !this.titleIsPublic,
      }).then((response) => {
        const { error } = response.data
        if (error) {
          console.log('there was an error setting title privacy', error)
          // @TODO: better error messaging
          // Reset toggle on error
          this.titleIsPublic = !this.titleIsPublic
        } else {
          this.modalVisible = false
        }
      }).catch((error) => {
        console.log('there was an error setting title privacy', error)
        // @TODO: better error messaging
        // Reset toggle on error
        this.titleIsPublic = !this.titleIsPublic
      })
    },
  },
}
</script>
