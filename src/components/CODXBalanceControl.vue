<template>
  <div class="codx-balance-container">
    <div>
      <h4>Credit Balance</h4>
      <div>{{ formattedTokenBalance }}</div>
    </div>
    <!-- <img id="codx-balance-info" src="../assets/icons/info.svg">

    <b-popover
      @click.stop
      boundary="viewport"
      class="popover-theme"
      triggers="hover click"
      target="codx-balance-info"
      :placement="popoverPlacement"
    >
      <div class="popover-theme">
        <p>@TODO: fill in popover here</p>
      </div>
    </b-popover> -->
  </div>
</template>

<script>

import is from 'is_js'
import { mapState } from 'vuex'

import formatTokenAmount from '../util/formatTokenAmount'

export default {
  name: 'CODXBalanceControl',

  computed: {
    ...mapState('auth', ['user']),

    popoverPlacement() {
      return is.mobile() ? 'top' : 'right'
    },

    formattedTokenBalance() {
      return `${formatTokenAmount(this.user.codxBalance)} CODX`
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

#codx-balance-info
  width: 1.2em
  height: @width
  vertical-align: text-bottom

.codx-balance-container
  width: 100%
  display: flex
  align-items: center
  word-break: break-all

  > div
    flex-grow: 1

  img
    opacity: .8

    &:hover
      opacity: .9

</style>
