<template>
  <span>
    <span class="hash-short">{{ formatData(data, true) }}</span>
    <span class="hash-large">{{ formatData(data, false) }}</span>
  </span>
</template>

<script>
export default {
  name: 'hash-formatter',
  props: ['data'],
  methods: {
    formatData(data, isShort = false) {
      if (!data) {
        return null
      }
      let formattedData = data
      if (isShort) {
        const beginning = data.substring(0, 6)
        const end = data.substring(data.length - 4)
        formattedData = `${beginning}…${end}`
      }
      return formattedData
    },
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.hash-short

  @media screen and (min-width: $breakpoint-xl)
    display: none

.hash-large
  display: none

  @media screen and (min-width: $breakpoint-xl)
    display: inline-block

</style>
