<template>
  <b-card
    @click.prevent="viewRecord"
    :img-src="codexRecord.metadata.mainImage ? codexRecord.metadata.mainImage.uri : missingImage"
    img-top
    v-if="codexRecord.metadata"
    title
  >
    <p>
      <a href="#" @click.prevent="viewRecord">
        {{ codexRecord.metadata.name }}
      </a>
    </p>
    <small>#{{ codexRecord.tokenId }}</small>
  </b-card>
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

.card
  card()
  min-width: 180px
  text-align: center
  cursor: pointer

.card-body
  border-top: 1px solid rgba(black, .1)

  a
    font-weight: bold
    color: $color-dark

  small
    color: $color-light-gray

</style>
