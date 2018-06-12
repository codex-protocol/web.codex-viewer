<template>
  <b-container class="record-settings-row">
      <!-- TODO: Better handling of record w/ no metadata -->
      <b-row v-if="codexRecord.metadata">
        <b-col class="image">
          <a href="#" @click.prevent="viewRecord">
            <img :src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage" />
          </a>
        </b-col>
        <b-col class="name">
          <a href="#" @click.prevent="viewRecord">
            {{ codexRecord.metadata.name }}
          </a>
        </b-col>
        <b-col class="toggle">
          <input
            type="checkbox"
            class="toggle-checkbox"
            v-model="recordIsPublic"
            @change="savePrivacySetting"
          />
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'

import EventBus from '../util/eventBus'
import missingImage from '../assets/images/missing-image.png'

export default {
  name: 'record-privacy-settings-row-item',
  props: ['codexRecord', 'isPrivate'],
  data() {
    return {
      missingImage,
      recordIsPublic: !this.isPrivate,
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
    }
  },
  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },
    savePrivacySetting() {

      const requestOptions = {
        method: 'put',
        url: `/users/records/${this.codexRecord.tokenId}`,
        data: {
          isPrivate: !this.recordIsPublic,
        },
      }

      axios(requestOptions)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record privacy: ${error.message}`)
          console.error('Could not update Record privacy:', error)
          this.recordIsPublic = !this.isPrivate // Reset toggle on error
        })
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.record-settings-row
  height: 6rem

  +.record-settings-row
    border-top: 1px solid $color-light-gray

.row
  height: 100%
  display: flex
  padding: 1rem 0
  align-items: center

.name
  flex-grow: 5
  font-weight: 300
  text-transform: uppercase

.toggle
  text-align: center

.image
  height: 100%

  img
    max-width: 5rem
    max-height: 100%

a
  color: $color-secondary

  &:hover
    text-decoration: none
</style>
