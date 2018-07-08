<template>
  <div class="faucet-card">
    <b-card>
      <p>
        <b>Finish setting up</b>
      </p>
      <ul>
        <li>Get some CODX from the faucet!</li>
        <li>Approve the registry contract</li>
      </ul>
      <b-button variant="primary">
        Next
      </b-button>
    </b-card>
  </div>
</template>

<script>
export default {
  name: 'faucet-marketing-card',
  computed: {
    balance() {

    },
    registryContractApproved() {

    },
  },
}
</script>

<style lang="stylus" scoped>
@import "../assets/variables.styl"

.faucet-card
  width: 25%
  max-width: 32rem
  margin-bottom: 2em

  .card-body
    text-align: left

  .card
    border-radius: 0 0 .25rem .25rem
    background-color: rgba(white, .1)

  button
    width: 100%

ul
  padding-left: 1rem
</style>
