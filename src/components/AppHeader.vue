<template>
  <div class="header">
    <h1 :class="{ 'show-network-details': showNetworkDetails }">{{ title }}</h1>
    <div class="network-details" v-if="showNetworkDetails">{{ web3.account }} ({{ web3.network }})</div>
    <div class="spacer"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  props: ['hideNetworkDetails', 'title'],
  computed: {
    web3() {
      return this.$store.state.web3
    },
    showNetworkDetails() {
      return !this.hideNetworkDetails && this.web3.account
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  height: 2.5rem
  font-size: 2.5rem
  margin-bottom: 2rem
  color: $color-primary

  display: flex
  align-items: center

  h1
    font-size: 1em
    font-weight: bold
    line-height: 1em
    font-family: $font-family-serif

    &.show-network-details
      margin: 0 .5em 0 0
      padding-right: .5em
      border-right: 1px solid $color-primary

  .network-details
    font-size: .4em
    word-wrap: break-word

  .spacer
    flex-grow: 1

  button
    margin-left: 1em
</style>
