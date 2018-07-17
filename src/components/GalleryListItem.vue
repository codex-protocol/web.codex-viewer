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
        :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
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

import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'gallery-list-item',
  props: ['gallery'],
  data() {
    return {
      route: { name: 'gallery', params: { galleryShareCode: this.gallery.shareCode } },
      missingImageHelper,
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
  card()
  min-width: 180px
  cursor: pointer
  background-color: #fff

  .card-header
    padding: 0

  .card-body
    a
      font-weight: bold
      color: $color-dark

    small
      color: $color-light-gray

</style>
