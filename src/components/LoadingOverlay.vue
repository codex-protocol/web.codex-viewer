<template>
  <div
    ref="overlay"
    class="loading-overlay"
    :class="type"
    v-if="show"
  ></div>
</template>

<script>
export default {
  name: 'loading-overlay',
  props: {
    show: {
      type: Boolean,
      default: true, // default is true so you can use v-else on a <loading-overlay> without also specifying this prop
    },
    type: {
      type: String,
      default: 'light',
    },
  },
  mounted() {
    // add a "loading-overlay-contianer" ref somewhere in the parent component
    //  to have it's position automatically set to "relative" (if it's not
    //  already positioned somehow)
    const loadingOverlayContainer = this.$parent.$refs['loading-overlay-contianer']
    if (loadingOverlayContainer) {
      if (window.getComputedStyle(loadingOverlayContainer).position === 'static') {
        loadingOverlayContainer.style.position = 'relative'
        this.$refs.overlay.style.position = 'absolute'
      }
    }
  },
}
</script>

<style lang="stylus" scoped>

@import "../assets/variables.styl"

.loading-overlay
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 998
  display: flex
  position: absolute
  align-items: center
  justify-content: center

  &::before
    content: ""
    width: 4rem
    height: 4rem
    z-index: 999
    display: block
    border-radius: 50%
    border-width: .5rem
    border-style: solid
    animation: spin 1s linear infinite

  &.light
    background-color: rgba(lighten($color-primary, 50%), .75)

    &::before
      border-color: rgba($color-secondary, .25)
      border-top-color: $color-secondary

  &.dark
  &.global
    background-color: rgba($color-dark, .8)

    &::before
      border-color: rgba($color-primary, .25)
      border-top-color: $color-primary

  &.global
    position: fixed

  @keyframes spin
    from
      transform: rotate(0deg)

    to
      transform: rotate(360deg)

</style>
