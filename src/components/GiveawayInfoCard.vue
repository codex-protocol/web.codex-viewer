<template>
  <div v-if="giveaway">
    <b-card>
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
  </div>
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
  height: 100%
  background-color: $color-dark
  border: 1px solid $color-light

div
  display: flex
  flex-direction: column
  justify-content: center
</style>
