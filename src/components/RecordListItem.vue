<template>
  <div class="record-card" v-if="codexRecord.metadata">
    <b-card
      @click.prevent="viewRecord"
      :img-src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage"
      img-top
    >
      <p>
        <a href="#" @click.prevent="viewRecord">
          {{ codexRecord.metadata.name }}
        </a>
      </p>
      <small>#{{ codexRecord.tokenId }}</small>
    </b-card>
  </div>
</template>

<script>

import missingImage from '../assets/images/missing-image.png'

export default {
  name: 'record-list-item',
  props: ['codexRecord'],
  data() {

    // TODO: Need a way to render records in collection w/ no metadata (e.g., one was created in a different Provider)
    if (!this.codexRecord.metadata) {
      console.warn('found Record with no metadata', this.codexRecord)
    }

    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      missingImage,
    }
  },
  methods: {
    viewRecord() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.record-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  .card
    border: none
    cursor: pointer
    border-radius: 0 0 .25rem .25rem

  img
    width: 100%
    max-height: 25vw // good enough ¯\_(ツ)_/¯
    min-height: 25vh // good enough ¯\_(ツ)_/¯
    object-fit: contain

  .card-body
    border-top: 1px solid rgba(black, .1)

    a
      font-weight: bold
      color: $color-dark

      // uncomment to keep record name on a single line?
      // display: block
      // overflow: hidden
      // white-space: nowrap
      // text-overflow: ellipsis

    small
      color: $color-light-gray

</style>
