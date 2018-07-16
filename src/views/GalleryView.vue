<template>
  <div v-if="gallery">
    <app-header :hide-network-details="true" :title="gallery.name">
      <b-button variant="outline-primary" @click="viewFullscreen" v-if="browserSupportsFullscreen">
        View Fullscreen
      </b-button>
    </app-header>

    <div class="carousel-container" ref="carousel-container">
      <b-carousel
        controls
        slot="header"
        v-model="slideIndex"
        class="fixed-size-carousel"
        :interval="gallery.slideDuration"
      >
        <b-carousel-slide
          :key="codexRecord.id"
          v-for="codexRecord in gallery.codexRecords"
          :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
        ></b-carousel-slide>
      </b-carousel>

      <p class="record-info">
        <a href="#" @click.prevent="viewRecord(currentCodexRecord.tokenId)">
          {{ currentCodexRecord.metadata.name }}
        </a>
      </p>
    </div>

    <b-card-group deck class="record-list">
      <record-list-item
        v-for="record in gallery.codexRecords"
        :codex-record="record"
        :key="record.tokenId"
      />
    </b-card-group>

  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import Gallery from '../util/api/gallery'
import fullscreenHelper from '../util/fullscreenHelper'
import missingImageHelper from '../util/missingImageHelper'

import AppHeader from '../components/AppHeader'
import RecordListItem from '../components/RecordListItem'

export default {
  name: 'gallery-view',
  components: {
    AppHeader,
    RecordListItem,
  },
  data() {
    return {
      gallery: null,
      slideIndex: 0,
      missingImageHelper,
      browserSupportsFullscreen: fullscreenHelper.browserSupportsFullscreen,
    }
  },
  created() {
    this.getGallery()
    EventBus.$emit('events:view-gallery-page')
  },
  watch: {
    $route: 'getGallery',
  },
  computed: {
    galleryShareCode() {
      return this.$route.params.galleryShareCode
    },
    currentCodexRecord() {
      return this.gallery.codexRecords[this.slideIndex]
    },
  },
  methods: {
    viewFullscreen() {
      fullscreenHelper.requestFullscreen(this.$refs['carousel-container'])
    },
    viewRecord(tokenId) {
      this.$router.push({ name: 'record-detail', params: { recordId: tokenId } })
    },
    getGallery() {
      Gallery.getGallery(this.galleryShareCode)
        .then((gallery) => {
          this.gallery = gallery
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get gallery: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

// a lot of these .carousel-container styles are mainly here for the fullscreen
//  view
.carousel-container
  width: 100%
  height: 100%
  display: flex
  align-items: center
  flex-direction: column
  justify-content: center
  background-color: $color-dark

.carousel
  width: 50%
  height: 50vh
  max-width: 50%

.record-info
  width: 50%
  padding: 1em
  margin 0 auto
  font-weight: 700
  text-align: center
  background-color: rgba(white, .01)

.record-list
  display: flex
  flex-wrap: wrap
  margin-top:  4rem

</style>
