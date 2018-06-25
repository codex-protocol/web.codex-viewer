<template>
  <div>
    <app-header title="CODX Faucet" />

    <div>
      <p>Your balance: {{ formatTokenAmount(userState.balance) }} CODX</p>
      <b-button variant="primary" v-b-modal.faucetModal>
        Get more CODX
      </b-button>
    </div>

    <faucet-modal />
  </div>
</template>

<script>
import EventBus from '../util/eventBus'

import AppHeader from '../components/AppHeader'
import FaucetModal from '../components/modals/FaucetModal'

export default {
  name: 'faucet-view',
  components: {
    AppHeader,
    FaucetModal,
  },
  created() {
    EventBus.$emit('events:faucet-page')
  },
  computed: {
    userState() {
      return this.$store.state.auth
    },
  },
  methods: {
    // @TODO: Abstract this out since it's used in several places
    formatTokenAmount(rawAmount) {
      return rawAmount.div('1e18').toFixed(3)
    },
  },
}
</script>

<style lang="stylus" scoped>

</style>
