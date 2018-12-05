<template>
  <div class="checkout-container">
    <div class="column">
      <slot></slot>
    </div>
    <div class="column">
      <div class="checkout-box">
        <h4>Summary</h4>
        <div class="line-item">
          <span>{{ action }} x 1</span>
          <span>{{ cost | formatCODXAmount }}</span>
        </div>
        <div class="line-item total">
          <span>Total</span>
          <span>{{ cost | formatCODXAmount }}</span>
        </div>
      </div>
      <div class="checkout-box">
        <h4>Your Credits</h4>
        <div class="line-item" :class="{ 'insufficient-codx': insufficientCODX }">
          <span>Current Balance</span>
          <span class="current-balance">{{ user.codxBalance | formatCODXAmount }}</span>
        </div>

        <div class="insufficient-codx-notice" v-if="insufficientCODX">
          <p>You need more CODX to continue.</p>
          <b-button variant="primary" to="/get-codx">
            Get More CODX
          </b-button>
        </div>
        <div class="line-item" v-else>
          <span>After This Transaction</span>
          <span>{{ newBalance | formatCODXAmount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'

export default {
  name: 'CODXCheckoutControl',

  props: {
    action: {
      type: String,
      required: true,
    },

    cost: {
      type: String,
      required: true,
    },

    newBalance: {
      type: Object,
      required: true,
    },

    insufficientCODX: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState('auth', ['user']),
  },
}
</script>

<style lang="stylus">

@import "../assets/variables.styl"

.checkout-container
  display: flex
  font-size: small
  text-align: left
  justify-content: space-between

  .column
    width: calc(50% - 1rem)

    .line-item
      width: 100%
      display: flex
      justify-content: space-between

      &+.line-item
        margin-top: 1rem

      &.insufficient-codx
        .current-balance
          font-weight: 700
          color: $color-danger

  .checkout-box
    padding: 1rem
    background-color: darken($color-secondary, 25%)

    &+.checkout-box
      margin-top: 1rem

    h4
      margin-bottom: 1.5rem

    .insufficient-codx-notice
      margin-top: 2rem
      font-size: smaller
      text-align: center
      color: $color-danger

      p
        margin-bottom: .5rem

      .btn
        width: 100%

    .total
      font-weight: 700
      padding-top: 1rem
      border-top: 1px dotted rgba($color-light, .1)

  @media screen and (max-width: $breakpoint-sm)
    flex-direction: column

    .column
      width: 100%

      &+.column
        margin-top: 2rem

</style>
