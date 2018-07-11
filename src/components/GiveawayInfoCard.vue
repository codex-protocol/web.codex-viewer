<template>
  <b-card v-if="giveaway">
    <p>
      The first {{ giveaway.numberOfEditions }} users to participate in the Beta will receive an edition of this piece created by our designer Seb!
    </p>
    <p>
      Click the 'Create Record' button to the left to claim yours.
    </p>
    <p>
      After the transaction has been mined by the blockchain (which may take a few minutes) your new Codex Record will appear in your collection.
    </p>
  </b-card>
</template>

<script>
export default {
  name: 'giveaway-info-card',
  props: ['giveaway'],
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
  background-color: $color-dark
  border: 1px solid $color-light
  border-radius: 0 0 .25rem .25rem

  @media screen and (min-width: $breakpoint-sm)
    max-width: calc((100% * 1/2) - 2rem)

  @media screen and (min-width: $breakpoint-md)
    max-width: calc((100% * 1/3) - 2rem)

  @media screen and (min-width: $breakpoint-lg)
    max-width: calc((100% * 1/4) - 2rem)

  @media screen and (min-width: $breakpoint-xl)
    max-width: calc((100% * 1/5) - 2rem)

</style>
