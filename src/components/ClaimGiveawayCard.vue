<template>
  <b-card
    v-if="giveaway"
    img-top
    :img-src="missingImageHelper.getMainImageUri(giveaway.editionDetails)"
  >
    <div class="overlay" v-if="isLoading">
      <img class="spinner" src="../assets/images/spinner.svg" />
    </div>
    <b-button
      variant="secondary"
      @click="acceptGiveaway"
      :disabled="disableGiveawayButton"
    >
      Create Record
    </b-button>
  </b-card>
</template>

<script>
import EventBus from '../util/eventBus'
import Giveaway from '../util/api/giveaway'
import missingImageHelper from '../util/missingImageHelper'

export default {
  name: 'claim-giveaway-card',
  props: ['giveaway'],
  data() {
    return {
      isLoading: false,
      missingImageHelper,
      disableGiveawayButton: false,
    }
  },
  methods: {
    acceptGiveaway() {
      // No need to toggle these off later--the toast will clean them up
      this.disableGiveawayButton = true
      this.isLoading = true

      Giveaway.participateInGiveaway(this.giveaway.id)
        .catch((error) => {
          EventBus.$emit('toast:error', `Could not claim edition: ${error.message}`)
          this.disableGiveawayButton = false
          this.isLoading = false
        })
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

button
  white-space: normal

.overlay
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 998
  display: flex
  position: absolute
  align-items: center
  justify-content: center
  background-color: rgba(255, 255, 255, .75)

.spinner
  width: 8em
  height: 8em
  z-index: 999
  animation: spin 1s linear infinite reverse

@keyframes spin
  from
    transform: rotate(0deg)

  to
    transform: rotate(360deg)
</style>
