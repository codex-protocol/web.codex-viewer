<template>
  <div class="title-card" v-if="codexTitle.metadata">
    <b-card
      @click.prevent="viewTitle"
      :img-src="codexTitle.metadata.mainImage.uri"
      img-top
    >
      <p>
        <a href="#" @click.prevent="viewTitle">
          {{ codexTitle.metadata.name }}
        </a>
      </p>
      <small>#{{ codexTitle.tokenId }}</small>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'title-list-item',
  props: ['codexTitle'],
  data() {

    // TODO: Need a way to render titles in collection w/ no metadata (e.g., one was created in a different Provider)
    if (!this.codexTitle.metadata) {
      console.log('found title with no metadata', this.codexTitle)
    }

    return {
      route: { name: 'title-detail', params: { titleId: this.codexTitle.tokenId } },
    }
  },
  methods: {
    viewTitle() {
      this.$router.push(this.route)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.title-card
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

      // uncomment to keep title name on a single line?
      // display: block
      // overflow: hidden
      // white-space: nowrap
      // text-overflow: ellipsis

    small
      color: $color-light-gray

</style>
