<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <app-header title="Galleries" />

        <div v-if="galleries.length">
          <b-card-group deck>
            <gallery-list-item
              v-if="gallery.codexRecords"
              v-for="gallery in galleries"
              :gallery="gallery"
              :key="gallery.id"
            />
            <b-card
              title="Coming Soon"
              class="upsell-card"
            >
              <p class="card-text">
                Create your own public galleries!
              </p>
              <p class="card-text">
                Soon you will be able to organize your Collection into public galleries so you can share groups of Codex Records like the one you see here.
              </p>
            </b-card>
          </b-card-group>
        </div>

        <div v-else>
          No galleries have been created yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventBus from '../util/eventBus'
import Gallery from '../util/api/gallery'

import AppHeader from '../components/AppHeader'
import GalleryListItem from '../components/GalleryListItem'

export default {
  name: 'gallery-list-view',
  components: {
    AppHeader,
    GalleryListItem,
  },
  data() {
    return {
      galleries: [],
    }
  },
  created() {
    this.getGalleries()
    EventBus.$emit('events:view-gallery-list-page', this)
  },
  methods: {
    getGalleries() {
      Gallery.getGalleries()
        .then((galleries) => {
          this.galleries = galleries
        })
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not get galleries: ${error.message}`)
        })
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.card
  card()
  min-width: 180px
  background-color: rgba(white, .1)

</style>
