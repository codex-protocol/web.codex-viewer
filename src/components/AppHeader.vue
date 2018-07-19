<template>
  <div class="header">
    <h1>{{ title }}</h1>
    <div class="buttons">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app-header',
  props: ['title'],
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.header
  font-size: 2.5rem
  margin-top: 1rem
  margin-bottom: 1rem
  color: $color-primary

  display: flex
  flex-direction: column

  h1
    font-size: 1em
    font-weight: bold
    line-height: 1em
    margin-bottom: 1rem
    font-family: $font-family-serif

  .buttons
      display: flex
      flex-direction: column

      @media screen and (min-width: $breakpoint-sm)
        flex-direction: row

  button
    margin-right: 1rem
    margin-bottom: 1rem
    width: 100%

    &:last-of-type
      margin-bottom: 0

    @media screen and (min-width: $breakpoint-sm)
      width: auto
      margin-bottom: 0

</style>
