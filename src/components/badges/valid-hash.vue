<template>
  <span class="valid-hash-badge">
    <template v-if="isValid">
      <img
        v-b-tooltip.hover
        src="../../assets/icons/check.svg"
        title="This record has not been tampered with; the calculated hash matches the value on the blockchain."
      >
    </template>
    <template v-else>
      <img
        v-b-tooltip.hover
        src="../../assets/icons/warning.svg"
        title="This record may have been tampered with; the calculated hash does not match the value on the blockchain."
      >
    </template>
  </span>
</template>

<script>

import { mapState } from 'vuex'

export default {

  props: {
    hash: {
      type: String,
      required: true,
    },
    string: {
      validator: (value) => {
        return typeof value === 'string' || value === null
      },
    },
    array: {
      validator: (value) => {
        return Array.isArray(value)
      },
    },
  },

  computed: {

    ...mapState('web3', ['instance']),

    isValid() {

      if (this.array) {
        return this.array.includes(this.hash)
      }

      if (this.string === null || this.string === '') {
        return this.hash === '0x0000000000000000000000000000000000000000000000000000000000000000'
      }
      return this.hash === this.instance.utils.soliditySha3(this.string || '')
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../../assets/variables.styl"

.valid-hash-badge
  img
    width: 1.2em
    height: @width
    margin-right: .5em
    vertical-align: middle

</style>
