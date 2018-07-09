<template>
  <div class="gallery-card" v-if="gallery.codexRecords">
    <b-card @click.prevent="viewGallery">
      <b-carousel
        slot="header"
        :interval="3000"
        class="fixed-size-carousel"
      >
        <b-carousel-slide
          :key="codexRecord.id"
          v-for="codexRecord in gallery.codexRecords"
          :img-src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage"
        ></b-carousel-slide>
      </b-carousel>
      <div class="card-text">
        <p>
          <a href="#" @click.prevent="viewGallery">
            {{ gallery.name }}
          </a>
        </p>
        <small class="text-muted">
          {{ gallery.description }}
        </small>
      </div>
    </b-card>
  </div>
</template>

<script>

import missingImage from '../assets/images/missing-image.png'

export default {
  name: 'gallery-list-item',
  props: ['gallery'],
  data() {
    return {
      route: { name: 'gallery', params: { galleryShareCode: this.gallery.shareCode } },
      missingImage,
    }
  },
  methods: {
    viewGallery() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.gallery-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  .card
    border: none
    cursor: pointer
    border-radius: 0 0 .25rem .25rem

  .card-header
    padding: 0
    height: 25vh

  .card-body
    a
      font-weight: bold
      color: $color-dark

    small
      color: $color-light-gray

</style>
