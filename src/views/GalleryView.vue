<template>
  <div
    v-if="gallery"
    class="container-fluid"
  >
    <div class="row">
      <div class="col-12">
        <AppHeader :title="gallery.name">
          <b-button variant="outline-primary" @click="copyShareLink" ref="copy-share-link-button">Copy Share Link</b-button>
          <b-button variant="outline-primary" @click="viewFullscreen" v-if="browserSupportsFullscreen">
            View Fullscreen
          </b-button>
        </AppHeader>

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
          <RecordListItem
            v-for="record in gallery.codexRecords"
            :codex-record="record"
            :key="record.tokenId"
          />
        </b-card-group>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import Gallery from '../util/api/gallery'
import copyToClipboard from '../util/copyToClipboard'
import fullscreenHelper from '../util/fullscreenHelper'
import missingImageHelper from '../util/missingImageHelper'

import AppHeader from '../components/core/AppHeader'
import RecordListItem from '../components/RecordListItem'

export default {
  name: 'GalleryView',

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

    copyShareLink() {
      copyToClipboard(window.location.href, 'Share link copied to clipboard!')
      this.$refs['copy-share-link-button'].focus()
    },

    viewRecord(tokenId) {
      this.$router.push({
        name: 'record-detail',
        params: {
          recordId: tokenId,
        },
      })
    },

    getGallery() {
      Gallery.getGallery(this.galleryShareCode)
        .then((gallery) => {
          if (!gallery.codexRecords || gallery.codexRecords.length === 0) {
            throw new Error(`${gallery.name} has no Codex Records to show.`)
          }
          this.gallery = gallery
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get gallery: ${error.message}`)
          this.$router.replace({ name: 'galleries' })
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.row
  display: block // turn off default `.row` flex display for fullscreen.

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
  width: 100%
  height: 100%
  padding: 1rem

  @media screen and (min-width: $breakpoint-md)
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
  display: none
  margin-top:  4rem
  padding: 1rem

  @media screen and (min-width: $breakpoint-md)
    display: flex
    flex-wrap: wrap

</style>
