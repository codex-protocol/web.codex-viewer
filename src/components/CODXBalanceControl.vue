<template>
  <div class="codx-balance-container">
    <h4>CODX Balance</h4>
    <div>{{ formattedTokenBalance }}</div>
  </div>
</template>

<script>

import is from 'is_js'
import { mapState } from 'vuex'

import formatTokenAmount from '../util/formatTokenAmount'

export default {
  name: 'CODXBalanceControl',

  computed: {
    ...mapState('auth', ['balance']),

    formattedTokenBalance() {
      return `${formatTokenAmount(this.balance)} CODX`
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

</style>
