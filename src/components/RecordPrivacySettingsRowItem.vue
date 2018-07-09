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
        <b-col class="toggle" v-if="user && user.isGalleryEnabled">
          <input
            type="checkbox"
            class="toggle-checkbox"
            v-model="isInGallery"
            @change="toggleIsInGallery"
          />
        </b-col>
        <b-col class="toggle">
          <input
            type="checkbox"
            class="toggle-checkbox"
            v-model="isPublic"
            @change="toggleIsPrivate"
          />
        </b-col>
      </b-row>
  </b-container>
</template>

<script>
import Record from '../util/api/record'
import EventBus from '../util/eventBus'
import missingImage from '../assets/images/missing-image.png'

export default {
  name: 'record-privacy-settings-row-item',
  props: ['codexRecord'],
  data() {
    return {
      missingImage,
      isPrivate: this.codexRecord.isPrivate,
      isInGallery: this.codexRecord.isInGallery,
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user
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
    viewRecord() {
      this.$router.push(this.route)
    },
    toggleIsPrivate() {
      if (this.isPrivate) {
        this.isInGallery = false
      }
      return this.updateRecord()
    },
    toggleIsInGallery() {
      if (this.isInGallery) {
        this.isPrivate = false
      }
      return this.updateRecord()
    },
    updateRecord() {

      const dataToUpdate = {
        isPrivate: this.isPrivate,
        isInGallery: this.isInGallery,
      }

      return Record.updateRecord(this.codexRecord.tokenId, dataToUpdate)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not update Record: ${error.message}`)
          console.error('Could not update Record:', error)
          this.reset()
        })
    },
    reset() {
      this.isPrivate = this.codexRecord.isPrivate
      this.isInGallery = this.codexRecord.isInGallery
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
