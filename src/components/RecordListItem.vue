<template>
  <b-card
    v-if="codexRecord.metadata"
    @click.prevent="viewRecord"
    :img-src="missingImageHelper.getMainImageUri(codexRecord.metadata)"
    img-top
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
import Raven from 'raven-js'

import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'record-list-item',
  props: ['codexRecord'],
  data() {

    if (!this.codexRecord.metadata) {
      Raven.captureMessage('found Record with no metadata', this.codexRecord, {
        level: 'warning',
      })
    }

    return {
      route: { name: 'record-detail', params: { recordId: this.codexRecord.tokenId } },
      missingImageHelper,
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
