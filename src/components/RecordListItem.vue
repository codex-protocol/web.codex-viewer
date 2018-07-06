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
  flex: none
  min-width: 180px
  text-align: center
  margin-bottom: 1rem
  margin-top: 1rem
  border: none
  cursor: pointer
  border-radius: 0 0 .25rem .25rem

  @media screen and (min-width: $breakpoint-sm)
    max-width: calc((100% * 1/2) - 2rem)

  @media screen and (min-width: $breakpoint-md)
    max-width: calc((100% * 1/3) - 2rem)

  @media screen and (min-width: $breakpoint-lg)
    max-width: calc((100% * 1/4) - 2rem)

  @media screen and (min-width: $breakpoint-xl)
    max-width: calc((100% * 1/5) - 2rem)

.card-body
  border-top: 1px solid rgba(black, .1)

  a
    font-weight: bold
    color: $color-dark

  small
    color: $color-light-gray

</style>
