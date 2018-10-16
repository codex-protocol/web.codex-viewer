<template>
  <div class="allowance-container" v-if="isSimpleUser">
    <div class="mb-3">
      <b class="mr-2">Prepaid Transactions</b>
      <img id="info" src="../assets/icons/info.svg">
    </div>
    <b-progress
      class="progress-container"
      :max="parseInt(user.gasAllowance, 10)"
    >
      <b-progress-bar
        class="progress-bar"
        :value="parseInt(user.gasAllowanceRemaining, 10)"
        :variant="variant"
      />
      <b-popover
        target="info"
        :placement="popoverPlacement"
        triggers="hover click"
        class="popover-theme"
        boundary="viewport"
        @click.stop
      >
        <div class="popover-theme">
          <p>
            <b>{{ percentageRemaining }}% remaining for this month</b>
          </p>
          <p>
            Your balance will reset on {{ resetDate }}.
          </p>
          Each month Codex gives you prepaid transactions that will pay for roughly:
          <ul>
            <li>10 Record Creations</li>
            <li>10 Modifications</li>
            <li>10 Transfers</li>
          </ul>
        </div>
      </b-popover>
    </b-progress>

  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
} from 'vuex'
import is from 'is_js'
import BigNumber from 'bignumber.js'

import { formatDate } from '../util/dateHelpers'

export default {
  name: 'PrepaidTransactionsControl',

  computed: {
    ...mapState('auth', ['user']),
    ...mapGetters('auth', ['isSimpleUser']),

    resetDate() {
      return formatDate(this.user.gasAllowanceNextResetAt, true)
    },

    percentageRemaining() {
      const remaining = new BigNumber(this.user.gasAllowanceRemaining)
        .div(this.user.gasAllowance)
        .mul(100)
        .toFixed(0)

      return remaining
    },

    popoverPlacement() {
      if (is.mobile()) {
        return 'top'
      }

      return 'right'
    },

    variant() {
      if (this.percentageRemaining < 15) {
        return 'danger'
      }

      if (this.percentageRemaining < 35) {
        return 'warning'
      }

      return 'success'
    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.allowance-container
  text-align: center
  width: 100%
  margin-top: 1rem

.progress-container
  background-color: rgba(white, .2)
  height: 2rem
  margin: 0.5rem

.progress-bar
  color: black
  font-weight: bold
  margin: 0.5rem


</style>

// @NOTE: Using unscoped styles here to override the popover theme
<style lang="stylus">
@import "../assets/variables.styl"
.popover
  box-shadow: 0.25rem 0.25rem 0.25rem $color-dark

.popover-body
  background-color: $color-secondary
  padding: 1rem

.bs-popover-right .arrow::after
  border-right-color: $color-secondary

.bs-popover-top .arrow::after
  border-top-color: $color-secondary
</style>
