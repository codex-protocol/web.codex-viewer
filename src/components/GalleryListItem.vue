<template>
  <b-card
    v-if="gallery.codexRecords"
    @click.prevent="viewGallery"
  >
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

.card
  flex: none
  min-width: 180px
  border: none
  cursor: pointer
  margin-bottom: 1rem
  margin-top: 1rem
  border-radius: 0 0 .25rem .25rem
  background-color: #fff

  @media screen and (min-width: $breakpoint-sm)
    max-width: calc((100% * 1/2) - 2rem)

  @media screen and (min-width: $breakpoint-md)
    max-width: calc((100% * 1/3) - 2rem)

  @media screen and (min-width: $breakpoint-lg)
    max-width: calc((100% * 1/4) - 2rem)

  @media screen and (min-width: $breakpoint-xl)
    max-width: calc((100% * 1/5) - 2rem)

  .card-header
    padding: 0

  .card-body
    a
      font-weight: bold
      color: $color-dark

    small
      color: $color-light-gray

</style>
